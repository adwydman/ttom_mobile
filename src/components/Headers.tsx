import Text from './Text';

interface IProps {
  children: any;
  style?: any;
}

export const H1 = ({ children, style = {} }: IProps) => {
  return <Text style={{ fontSize: 24, lineHeight: 24, marginTop: 24, marginBottom: 16, fontFamily: 'Niveau_smallCaps', ...style}}>{children}</Text>
}

export const H2 = ({ children, style = {} }: IProps) => {
  return <Text style={{ fontSize: 20, lineHeight: 24, marginTop: 16, marginBottom: 8, fontFamily: 'Niveau_smallCaps', ...style}}>{children}</Text>
}

export const H3 = ({ children, style = {} }: IProps) => {
  return <Text style={{ fontFamily: 'NiveauGroteskMedium', ...style}}>{children}</Text>
}
