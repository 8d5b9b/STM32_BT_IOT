import base64 from "react-native-base64";

function convertStringToByteArray(str: string) {
  var bytes = [];
  for (var i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

function combineBytes(byteArray: number[], start: number, numBytes: number) {
  let result = 0;
  for (let i = start; i < start + numBytes; i++) {
    result = result << 8;
    result += byteArray[i];
  }
  return result;
}

export default function decodeMessage(message: string) {
  const byteArray = convertStringToByteArray(base64.decode(message));
  const num_readings = combineBytes(byteArray, 0, 2);
  const readings = [];
  for (let i = 0; i < num_readings; i++) {
    const start = 2; //+ i * 16;
    const reading = {
      timestamp: combineBytes(byteArray, start, 4),
      pressure: combineBytes(byteArray, start + 4, 2),
      temperature: combineBytes(byteArray, start + 6, 4) / 10,
      humidity: combineBytes(byteArray, start + 10, 2),
      noise: combineBytes(byteArray, start + 12, 4),
    };
    readings.push(reading);
  }
  return readings;
}
