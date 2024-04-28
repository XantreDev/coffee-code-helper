import {Route, Router} from '@solidjs/router'
import { LoginScreen } from './features/LoginScreen'

export const AppRouter = () => (
  <Router>
    <Route component={LoginScreen} />
  </Router>
)