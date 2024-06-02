import * as typia from "typia";

export type PlaceData = {
	name: string & typia.tags.MinLength<1>;
	address: string & typia.tags.MinLength<1>;
	googleMapsLink: string & typia.tags.MinLength<1> & typia.tags.Format<"url">;
};

export type Place = {
	id: string;

	createdAt: string & typia.tags.Format<"date-time">;
	updatedAt: string & typia.tags.Format<"date-time">;
} & PlaceData;

export const placeData = {
	validate: typia.createValidate<PlaceData>(),
} as const;

export const iValidation = {
	toJSON: typia.json.createStringify<typia.IValidation<PlaceData>>(),
};

export const place = {
	validate: typia.createValidate<Place>(),
	validateMany: typia.createValidate<Place[]>(),
	toJSON: typia.json.createStringify<Place>(),
	fromJSON: typia.json.createAssertParse<Place>(),
} as const;

export const places = {
	validate: typia.createValidate<Place[]>(),
	toJSON: typia.json.createStringify<Place[]>(),
	fromJSON: typia.json.createAssertParse<Place[]>(),
} as const;
