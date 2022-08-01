import unpack from 'scratch-parser';

unpack('{}', false, (error, unpacked) => {
  if (error) {
    console.error(error);
  } else {
    const [target, zip] = unpacked;
  }
});
