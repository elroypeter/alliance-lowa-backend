import * as Fs from 'fs';
import * as Path from 'path';
import { v4 as uuidv4 } from 'uuid';

const CreateFile = async (base46: string): Promise<any> => {
  const b64StringArr: string[] = base46.split(',');
  const b64 = b64StringArr[1];
  const fileType = b64StringArr[0].split('/')[1].split(';')[0];
  const fileName = uuidv4();
  const filePath = Path.join(
    __dirname,
    '../../public/',
    `${fileName}.${fileType}`,
  );

  await Fs.writeFile(filePath, b64, 'base64', (error) => {
    if (error) error;
    return 'File created';
  });

  return { image: `${fileName}.${fileType}`, filePath };
};

const DeleteFile = async (filePath: string) => {
  await Fs.unlink(filePath, (error) => {
    if (error) error;
    return 'File deleted';
  });
};

export { CreateFile, DeleteFile };
