declare const stream: JSZip.StreamHelper<'uint8array'>;

stream.on('data', data => {
    data as Uint8Array
});
stream.on('data', (data, metadata) => {
    metadata.percent as number
});

stream.pause();
stream.resume();

// @ts-expect-error
stream.on('whatever', () => {

});
