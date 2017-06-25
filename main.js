const socket = io('https://tienrtc.herokuapp.com/');

$('#div-chat').hide();

socket.on('Online', userInfo => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();
    userInfo.forEach(function(user) {
        const { ten, peerId } = user;
        $('#onlineUser').append(`<li id="${peerId}">${ten}</li>`);
    }, this);
});

socket.on('NewUserConnect', userInfo => {
    const { ten, peerId } = userInfo;
    $('#onlineUser').append(`<li id="${peerId}">${ten}</li>`);
});

socket.on('UserExist', () => {
    alert('vui long chon username khac');
});

socket.on('Disconnect', peerId => {
    $(`#${peerId}`).remove();
});

function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

const peer = new Peer({ key: 'nr5mhssyhcmims4i' });
peer.on("open", id => {
    $('#my-peer').append(id);
    $('#btnSignup').click(() => {
        const username = $('#txtUsername').val();
        socket.emit("Register", { ten: username, peerId: id });
    });
});

$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => {
                playStream('remoteStream', remoteStream);
            })
        });
});

peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);

            call.on('stream', remoteStream => {
                playStream('remoteStream', remoteStream);
            });
        });
});

$('#onlineUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => {
                playStream('remoteStream', remoteStream);
            })
        });
});