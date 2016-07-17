main();

function main()
{
    requestLocalStream();
}

function log(message, type=null)
{
    console.log(message);
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
    log('Got stream!', 'success');
    printAudioDevice(stream);
    establishOuroborosConnection(stream);
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

function establishOuroborosConnection(stream)
{
    log('Establishing ouroboros connection...');

    window.sender = new RTCPeerConnection();
    window.sender.onicecandidate = senderIceCallback;
    window.sender.addStream(stream);

    var offer = window.sender.createOffer();
    offer.then(senderGotDescription);

    window.receiver = new RTCPeerConnection();
    window.receiver.onicecandidate = receiverIceCallback;
    window.receiver.onaddstream = receiverGotStream;
}

function senderIceCallback(e)
{
    if (!e.candidate)
        return;

    log('New sender ICE candidate');
    var candidate = new RTCIceCandidate(e.candidate);
    window.receiver.addIceCandidate(candidate);
}

function senderGotDescription(description)
{
    log('Sender got session description');

    window.sender.setLocalDescription(description);
    window.receiver.setRemoteDescription(description);

    var answer = window.receiver.createAnswer();
    answer.then(receiverGotDescription);
}

function receiverIceCallback(e)
{
    if (!e.candidate)
        return;

    log('New receiver ICE candidate');
    var candidate = new RTCIceCandidate(e.candidate);
    window.sender.addIceCandidate(candidate);
}

function receiverGotDescription(description)
{
    log('Receiver got session description');
    window.receiver.setLocalDescription(description);
    window.sender.setRemoteDescription(description);
}

function receiverGotStream(e)
{
    log('Receiver got stream!', 'success');
    var receiverAudioElement = document.getElementById('receiver');
    receiverAudioElement.srcObject = e.stream;
}
