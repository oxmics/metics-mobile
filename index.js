import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { en, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en', en)
AppRegistry.registerComponent(appName, () => App);
