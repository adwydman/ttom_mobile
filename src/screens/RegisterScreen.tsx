import { IScreenProps } from '../shared/apitypes';
import CredentialsScreen from './CredentialsScreen';

export default function RegisterScreen({ navigation, route }: IScreenProps) {
  return (
    <CredentialsScreen
      mode={'register'}
      navigation={navigation}
    />
  )
}
