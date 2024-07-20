
function appendOnclick() {
    // 为目录的点击添加高亮标题的事件
    var aTagElements = document.getElementsByTagName('nav')[0].getElementsByTagName('a');
    for (var element of aTagElements) {
        element.addEventListener('click', (event) => {
            var thisHref = event.target.getAttribute('data-linkto');
            var headlineEle = document.getElementById(thisHref);
            var originClass = headlineEle.className.split(' ');
            if (thisHref!='0'){
                headlineEle.className = originClass.concat('onHover').join(' ');
                headlineEle.scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"});
                setTimeout(() => {
                    headlineEle.className = originClass;
                }, 1000);
            }
            var eleRect = headlineEle.getBoundingClientRect();
            var bodyRect = document.body.getBoundingClientRect();
            window.scroll({top:eleRect.top - bodyRect.top, left:eleRect.left - bodyRect, behavior:"smooth"});
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
    for (var element of rubys) {
        element.addEventListener('click', (event) => {
            event.stopPropagation();
            playNameAudios(getPinyinsOfRtsInRuby(event.target));
        });
    }
}

// 传入一个ruby元素，返回其内所有非空拼音的数组
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
function playNameAudios(names) {
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