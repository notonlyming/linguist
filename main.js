
function appendOnclick() {
    // 获取所有粤语rt
    const rts = document.getElementById('jyut6jyu2').getElementsByTagName('rt');
    // 为粤语拼音rt监听事件并调用播放音频
    for (const element of rts) {
        if (element.innerText != "") {
            element.addEventListener('click', (event) => {
                event.stopPropagation();
                playAudios(element.innerText.split(" "));
            });
        }
    }

    // 为所有粤语展示句子添加连续播放音频功能
    var rubys = document.getElementById('jyut6jyu2').getElementsByClassName('exampleshow');
    for (var element of rubys) {
        var allRtTag = element.getElementsByTagName('rt');
        var allNames = [];
        for (i = 0; i < allRtTag.length; i++) {
            if (element.innerText != "") {
                allNames = allNames.concat(allRtTag[i].innerText.split(' '));
            }
        }
        allNames = allNames.filter(name => (name != ''));
        //console.log(allNames);
        const names = allNames.slice();
        element.addEventListener('click', (event) => {
            event.stopPropagation();
            playAudios(names);
        });
    }
}

// 对传入的粤拼数组播放音频
function playAudios(names) {
    console.log("Clicked " + names);
    var nameList = names.slice();
    playNext();

    function playNext() {
        var currentName = nameList.shift();
        var audio = new Audio(`low/${currentName}.wav`)
        audio.play();
        audio.addEventListener('ended', () => {
            if (nameList.length > 0) {
                playNext()
            }
        });
    }
}