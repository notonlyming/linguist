
function appendOnclick() {
    // 为目录的点击添加高亮标题的事件
    var aTagElements = document.getElementsByTagName('nav')[0].getElementsByTagName('a');
    for (var element of aTagElements) {
        element.addEventListener('click', (event) => {
            titleOfContentClick(event.target);
        });
    }

    // 为所有粤语rt添加播放事件
    const jyutSectionId = 'jyut6jyu2'
    // 获取所有粤语rt
    var rts = document.getElementById(jyutSectionId).getElementsByTagName('rt');
    // 为粤语拼音rt监听事件并调用播放音频
    for (var element of rts) {
        if (element.innerText != "") {
            element.addEventListener('click', (event) => {
                event.stopPropagation();
                playNameAudios(event.target.innerText.split(" "));
            });
        }
    }

    // 为所有粤语展示句子添加连续播放音频功能
    var rubys = document.getElementById(jyutSectionId).getElementsByClassName('exampleshow');
    for (const element of rubys) {
        element.parentElement.addEventListener('click', (event) => {
            event.stopPropagation();
            playNameAudios(getPinyinsOfRtsInRuby(element));
        });
    }
}

// 设置元素高亮
function setElementHightLightStatus(elementToSet, status) {
    var originClass = elementToSet.className.split(' ');
    if(status){
        elementToSet.className = originClass.concat('onHover').join(' ');
    } else {
        elementToSet.className = originClass.filter(item => item!="onHover").join(' ');
    }
}

// 定义了目录标题被点击后会做的事情（滚动并高亮对应标题）
function titleOfContentClick(clickedLi) {
    var thisHref = clickedLi.getAttribute('data-linkto');
    var headlineEle = document.getElementById(thisHref);
    if (thisHref){
        var eleRect = headlineEle.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();
        // 滚动到标题所在处
        window.scroll({top:eleRect.top - bodyRect.top, left:eleRect.left - bodyRect, behavior:"smooth"});

        // 高亮标题一秒
        setElementHightLightStatus(headlineEle, true);
        setTimeout(() => {
            setElementHightLightStatus(headlineEle, false);
        }, 1000);
    }
}

// 传入一个ruby元素，返回可播放的非空拼音的数组
function getPinyinsOfRtsInRuby(aRuby) {
    var allRtTag = aRuby.getElementsByTagName('rt');
    var allNames = [];
    for (i = 0; i < allRtTag.length; i++) {
        if (aRuby.innerText != "") {
            allNames = allNames.concat(allRtTag[i].innerText.split(' '));
        }
    }
    return allNames.filter(name => (name != ''));
}

// 对传入的数组播放音频
function playNameAudios(names, rts) {
    console.log("Clicked " + names);
    // 生成audio数组
    var audioList = Array();
    for(i=0; i<names.length; i++) {
        audioList.push(new Audio(`low/${names[i]}.wav`));
        audioList[i].load();
    }

    playNext();
    function playNext() {
        var currentAudio = audioList.shift();
        currentAudio.play();
        currentAudio.addEventListener('ended', () => {
            if (audioList.length > 0) {
                playNext();
            }
        });
    }
}