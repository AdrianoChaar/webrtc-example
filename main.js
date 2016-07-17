main();

function main()
{
    requestLocalStream();
}

function log(message, type=null)
{
    var line = document.createElement('div');
    line.textContent = message;
    line.classList.add('log');
    if (type)
        line.classList.add(type);
    document.body.appendChild(line);
}

function requestLocalStream()
{
    log('Requesting voice stream...');
    var request = navigator.mediaDevices.getUserMedia({audio: true});
    request.then(gotLocalStream);
    request.catch(failedToGetLocalStream);
}

function gotLocalStream(stream)
{
    window.stream = stream;
    log('Got stream!', 'success');
    printAudioDevice(stream);
}

function printAudioDevice(stream)
{
    var audioTracks = stream.getAudioTracks();
    console.log(stream);
    console.log(audioTracks);
    if (audioTracks.length > 0)
        log('Audio device: ' + audioTracks[0].label);
}

function failedToGetLocalStream(e)
{
    log('Failed to get stream: ' + e.toString(), 'error');
}
