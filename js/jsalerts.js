
const BUTTON_OK = 0
const BUTTON_CONFIRM = 1

const scrollKeys = {37: 1, 38: 1, 39: 1, 40: 1};

const preventDefault = (e) => {
    e = e || window.event
    if (e.preventDefault) { e.preventDefault() }
    e.returnValue = false
}

const preventDefaultForScrollKeys = (e) => {
    if (scrollKeys[e.keyCode]) {
        preventDefault(e)
        return false
    }
}

let defaultScroll = window.onscroll
const disableScroll = () => {
    let yOffset = window.pageYOffset
    window.onscroll = () => window.scrollTo(0, yOffset)
}

const enableScroll = () => window.onscroll = defaultScroll

const animateDiv = (div) => {
    div.style.top = window.pageYOffset + 'px'
    let destY = window.pageYOffset + Math.floor(window.innerHeight * 0.2 - 150)
    let anim = setInterval(() => {
        let px = parseInt(div.style.top.replace('px', ''))
        div.style.top = px + 2 + 'px'
        if (px + 2 >= destY) { clearInterval(anim) }
    }, 5)
}

window.alert = (message, title, onConfirm = null) => {
    let div = document.createElement('div')
    div.className = 'jsalert'
    if (!title) { title = 'Alert' }
    div.innerHTML = `<h3 class="noselect">${title}</h3><p>${message}</p><span><button class="jsalert-ok">OK</button></span>`
    div.tabIndex = '0'
    div.style.top = window.pageYOffset
    div.classList.add('noselect')
    disableScroll()
    document.body.prepend(div)
    animateDiv(div)
    div.focus()
    div.onkeyup = (e) => {
        if(e.which === 13 || e.which === 27) {
            e.target.remove()
            if (!document.querySelector('jsalert')) { enableScroll() }
            if (typeof onConfirm === 'function') { onConfirm() }
        }
    }
    div.querySelector('button').onclick = (e) => {
        e.target.parentElement.parentElement.remove()
        if (!document.querySelector('jsalert')) { enableScroll() }
    }
}

const handleKeyUp = (e, onConfirm, onCancel, target, div) => {
    if(e.which === 13 || e.which === 27) {
        target.remove()
        if (!document.querySelector('jsalert')) { enableScroll() }
        if (e.which === 13) {
            if (typeof onConfirm === 'function') { onConfirm(div.querySelector('input') ? div.querySelector('input').value : e) }
        } else {
            if (typeof onCancel === 'function') { onCancel() }
        }
    }
}

const handleBtnClick = (e, onConfirm, onCancel, target, div) => {
    if (e.target.innerHTML === 'Cancel') { 
        if (typeof onCancel == 'function') { onCancel() }
    } else {
        if (typeof onConfirm == 'function') { onConfirm(div.querySelector('input') ? div.querySelector('input').value : e) }
    }
    target.remove()
    if (!document.querySelector('jsalert')) { enableScroll() }
}

window.confirm = (message, title, onConfirm = null, onCancel = null) => {
    let div = document.createElement('div')
    div.className = 'jsalert'
    if (!title) { title = 'Alert' }
    div.innerHTML = `<h3 class="noselect">${title}</h3><p>${message}</p><span><button class="jsalert-ok">OK</button> <button class="jsalert-cancel">Cancel</button></span>`
    div.tabIndex = '0'
    div.classList.add('noselect')
    animateDiv(div)
    disableScroll()
    document.body.prepend(div)
    div.focus()
    div.onkeyup = (e) => {
        handleKeyUp(e, onConfirm, onCancel, e.target)
    }
    div.querySelectorAll('button').forEach((btn) => {
        btn.onclick = (e) => handleBtnClick(e, onConfirm, onCancel, e.target.parentElement.parentElement)
    })
}


window.prompt = (title, defaultText = '', onConfirm = null, onCancel = null) => {
    let div = document.createElement('div')
    div.className = 'jsalert'
    if (!title) { title = 'Alert' }
    div.innerHTML = `<h3 class="noselect">${title}</h3><p><input type="text" value="${defaultText}" class="jsalert-value" /></p><span><button class="jsalert-ok">OK</button> <button class="jsalert-cancel">Cancel</button></span>`
    div.tabIndex = '0'
    div.classList.add('noselect')
    animateDiv(div)
    disableScroll()
    document.body.prepend(div)
    div.querySelector('input').focus()
    div.querySelector('input').onkeyup = (e) => { 
        e.stopPropagation()
        handleKeyUp(e, onConfirm, onCancel, e.target.parentElement.parentElement, div)
    }
    div.onkeyup = (e) => handleKeyUp(e, onConfirm, onCancel, e.target)
    div.querySelectorAll('button').forEach((btn) => {
        btn.onclick = (e) => handleBtnClick(e, onConfirm, onCancel, e.target.parentElement.parentElement, div)
    })
}