import base64 from "react-native-base64";

function convertStringToByteArray(str: string) {
  var bytes = [];
  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

export default function decodeMessage(message: string) {
  const byteArray = convertStringToByteArray(base64.decode(message));
  return byteArray;
}
