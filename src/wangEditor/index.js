import E from 'wangeditor'

// const {$,BtnMenu} = E
// import {state} from './observer'

export const test1 = 'safaf'

const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E
export class AlertMenu extends BtnMenu {
  constructor (editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = E.$(
            `<div class="w-e-menu" data-title="Alert">
                <button>alert11</button>
            </div>`
    )
    super($elem, editor)
  }

  // 菜单点击事件
  clickHandler () {
    // alert('hello world')
  }

  tryChangeActive () {
    this.active()
  }
}

export class Video1 extends BtnMenu {
  constructor (editor) {
    const $elem = E.$(
            `<div class"w-e-menu" data-title="视频">
				<i class="w-e-icon-play"></i>
				<button>alert1133</button>
			</div>`
    )
    // const $elem = $(
    //     `<div class"w-e-menu" data-title="Alert">
    // 		<i class="w-e-menu"></i>
    // 		<button>视频</button>
    // 	</div>`
    // )
    super($elem, editor)
  }

  // 菜单点击事件
  clickHandler () {
    // 弹框自定义视频列表
    // state.selVideoDialog = true
  }

  // 尝试修改菜单 active状态,不改就不写，比如加粗要标亮的时候使用
  tryChangeActive () {
    this.active()
  }
}

export class Voice1 extends BtnMenu {
  constructor (editor) {
    const $elem = $(
            `<div class"w-e-menu" data-title="音频">
				<i class="w-e-icon-play"></i>
				<buttoon></buttoon>
			</div>`
    )
    super($elem, editor)
  }

  // 菜单点击事件
  clickHandler () {
    // 弹框自定义音频列表
    alert('this is 音频')
    // state.selVoiceDialog = true
  }

  // 尝试修改菜单 active状态
  tryChangeActive () {}
}
