import { IScreenProps } from '../shared/apitypes';
import CredentialsScreen from './CredentialsScreen';

export default function LoginScreen({ navigation, route }: IScreenProps) {
  return (
    <CredentialsScreen
      mode={'login'}
      navigation={navigation}
    />
  )
}
