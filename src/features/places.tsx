import {
  createDeferred,
  createSignal,
  For,
  Show,
  Signal,
  untrack,
} from "solid-js";
import { validation } from "../validation";
import { A, useNavigate } from "@solidjs/router";
import { PlaceData } from "../validation/generated";
import { nanoid } from "nanoid";

const createStorageSignal = <T,>(
  key: string,
  serializer: {
    toJSON: (value: T) => string;
    fromJSON: (value: string) => T;
  },
  initial: () => NoInfer<T>
) => {
  const [get, set] = createSignal(undefined as T);

  let isInitialized = false;
  const initSignal = () => {
    if (isInitialized) {
      return;
    }
    const json = localStorage.getItem(key);
    if (json !== null) {
      return set(() => serializer.fromJSON(json));
    }
    isInitialized = true;
    return set(() => initial());
  };

  const returnSig = [
    (() => {
      untrack(() => {
        initSignal();
      });

      return get();
    }) satisfies typeof get,
    ((...args) => {
      // @ts-expect-error
      const newValue = set(...args);

      localStorage.setItem(key, serializer.toJSON(newValue));

      return newValue;
    }) satisfies typeof set,
  ] as Signal<T>;

  return returnSig;
};

const [places, setPlaces] = createStorageSignal(
  "places",
  validation.places,
  () => []
);

export const PlacesScreen = () => {
  return (
    <div class="grid auto-cols-fr auto-rows-fr">
      <A href="/place/new" class="btn">
        Create new
      </A>
      <For each={places()}>
        {(place) => (
          <div class="card w-96 bg-primary text-primary-content">
            <div class="card-body">
              <strong class="card-title">{place.name}</strong>
              <h2 class="card-title">Card title!</h2>
              <p>{place.address}</p>
              <div class="card-actions justify-end">
                <A class="btn" href={`/place/edit/${place.id}`}>
                  Edit
                </A>
              </div>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export const PlaceScreen = (
  props:
    | {
        action: "edit";
        id: string;
      }
    | {
        action: "create";
      }
) => {
  const [place, setPlace] = createSignal<Partial<PlaceData>>(
    props.action === "edit" ? places().find((it) => it.id === props.id)! : {}
  );

  const placeValidation = createDeferred(
    () => validation.placeData.validate(place()),
    {
      timeoutMs: 500,
    }
  );

  const Input = (props: {
    value: string;
    name: string;
    placeholder: string;
    onChange: (value: string) => void;
  }) => (
    <label class="input input-bordered flex items-center gap-2">
      {props.name}
      <input
        onChange={(e) => props.onChange(e.currentTarget.value)}
        type="text"
        class="grow"
        value={props.value}
        placeholder={props.placeholder}
      />
    </label>
  );

  const navigate = useNavigate();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const validationResult = validation.placeData.validate(place());
        if (!validationResult.success) {
          return;
        }

        if (props.action === "create") {
          const newItem: validation.Place = {
            ...validationResult.data,
            id: nanoid(),

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setPlaces([...places(), newItem]);

          navigate(`/place/edit/${newItem.id}`, {
            replace: true,
          });
          return;
        }
        setPlaces(
          places().map(
            (it): validation.Place =>
              it.id === props.id
                ? {
                    ...it,
                    ...validationResult.data,
                    updatedAt: new Date().toISOString(),
                  }
                : it
          )
        );
      }}
      class="flex flex-col"
    >
      <div class="flex flex-col gap-2">
        <Input
          value={place().name ?? ""}
          name="Name"
          placeholder="Starbucks"
          onChange={(it) => {
            setPlace({ ...place(), name: it });
          }}
        />

        <Input
          value={place().address ?? ""}
          name="Address"
          placeholder="Pushkin street 14"
          onChange={(it) => {
            setPlace({ ...place(), address: it });
          }}
        />

        <Input
          value={place().googleMapsLink ?? ""}
          name="Google maps link"
          placeholder=""
          onChange={(it) => {
            setPlace({ ...place(), googleMapsLink: it });
          }}
        />
      </div>

      <div class="flex mt-4 justify-between">
        <Show when={!placeValidation().success}>
          <div>{validation.iValidation.toJSON(placeValidation())}</div>
        </Show>
        <button
          disabled={!placeValidation().success}
          class="ml-auto btn btn-primary"
        >
          Save
        </button>
      </div>
    </form>
  );
};
