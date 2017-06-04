/**
 * Created by Delneg on 04.06.17.
 */
import Toast from 'react-native-root-toast';
export default function showToast(message,duration = Toast.durations.LONG, position = Toast.positions.BOTTOM) {
  return Toast.show(message, {
    duration: duration,
    position: position,
    shadow: true,
    animation: true,
    hideOnPress: true,
  });

}