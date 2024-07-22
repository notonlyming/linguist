
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
                playNameAudios(getPinyinAndRtMapListInRt(event.target));
            });
        }
    }

    // 为所有粤语展示句子添加连续播放音频功能
    var rubys = document.getElementById(jyutSectionId).getElementsByClassName('exampleshow');
    for (const element of rubys) {
        element.parentElement.addEventListener('click', (event) => {
            event.stopPropagation();
            playNameAudios(getPinyinAndRtMapListInRuby(element));
        });
    }
}

// 设置元素高亮
function setElementHightLightStatus(elementToSet, className, status) {
    var originClass = elementToSet.className.split(' ');
    if(status){
        elementToSet.className = originClass.concat(className).join(' ');
    } else {
        elementToSet.className = originClass.filter(item => item!=className).join(' ');
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
        setElementHightLightStatus(headlineEle, 'highLight', true);
        setTimeout(() => {
            setElementHightLightStatus(headlineEle, 'highLight', false);
        }, 1000);
    }
}

// 获取单个Rt的拼音和rt的MapList
function getPinyinAndRtMapListInRt(aRt) {
    var pinyinAndRtMapList = [];
    // 如果rt为空，则不加入待发声的数组
    if (aRt.innerText != "") {
        // 对每个拼音都分配同一个rt的数据结构，处理一个rt有多个拼音的情况，方便播放函数高亮
        let pinyins = aRt.innerText.split(' ');
        for(j=0; j<pinyins.length; j++) {
            pinyinAndRtMapList.push(new Map([
                ['pinyin', pinyins[j]],
                ['rt', aRt]
            ]));
        }
    }
    return pinyinAndRtMapList;
}

// 传入一个ruby元素，返回可播放的非空拼音的数组
function getPinyinAndRtMapListInRuby(aRuby) {
    var allRtTag = aRuby.getElementsByTagName('rt');
    var allPinyinAndRtMapList = [];
    // 遍历每一rt的拼音生成数据结构
    for (i = 0; i < allRtTag.length; i++) {
        allPinyinAndRtMapList = allPinyinAndRtMapList.concat(
            getPinyinAndRtMapListInRt(allRtTag[i])
        );
    }
    return allPinyinAndRtMapList;
}

// 对传入的数组播放音频
function playNameAudios(pinyinAndRtList) {
    // 对list里的每个map生成audio对象
    var pinyinAndRtAndAudioList = pinyinAndRtList.slice();
    for(i=0; i<pinyinAndRtAndAudioList.length; i++) {
        pinyinAndRtAndAudioList[i].set(
            'audio', 
            new Audio(`low/${pinyinAndRtAndAudioList[i].get('pinyin')}.wav`)
        );
        pinyinAndRtAndAudioList[i].get('audio').load();
    }

    playNext();
    function playNext() {
        // 取出一个map
        var currentMap = pinyinAndRtAndAudioList.shift();
        setElementHightLightStatus(currentMap.get('rt'), 'rtHighLight', true);
        currentMap.get('audio').play();
        currentMap.get('audio').addEventListener('ended', () => {
            setElementHightLightStatus(currentMap.get('rt'), 'rtHighLight', false);
            if (pinyinAndRtAndAudioList.length > 0) {
                playNext();
            }
        });
    }
}