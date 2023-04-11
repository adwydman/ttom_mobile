import { IScreenProps } from '../shared/apitypes';
import CredentialsScreen from './CredentialsScreen';

export default function RegisterScreen({ navigation }: IScreenProps) {
  return (
    <CredentialsScreen
      mode={'register'}
      navigation={navigation}
    />
  )
}
