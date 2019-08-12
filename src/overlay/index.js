import styles from './index.styl';

const DEFAULT_OPTIONS = {
    title: '', // String
    content: '', // String
    callback_confirm: null, // Function
    callback_cancel: null, // Function
    text_confirm: '确定', // String
    text_cancel: '取消', // String
    flag_html_as_content: false, // Boolean
    flag_lock_page_scroll: true // Boolean
};

const VALID_OPTION_KEYS = Object.keys(DEFAULT_OPTIONS);

class Overlay {
    constructor(input = {}) {
        let accepted = {};
        VALID_OPTION_KEYS.forEach(k => {
            if (k in input) {
                // TODO: type check
                accepted[k] = input[k]
            }
        });
        this._options = Object.assign({}, DEFAULT_OPTIONS, accepted);
        this._id = `${(new Date()).valueOf()}${Math.ceil(Math.random() * 1e3)}`;
        this._isMounted = false; // 挂载到DOM
        this._isOpened = false; // 显示<Overlay/>
        this._mountNode = null; // 挂载DOM Node
        //
        this.init()
    }

    // init
    init() {
        const $elem = this.createElems();
        this.mount($elem);
        this.bindEvents();
    }

    // create <overlay/> dom structure with _options
    createElems() {
        const fragment = document.createDocumentFragment();
        // 覆盖层容器
        const $cover = document.createElement('div');
        $cover.setAttribute('id', `overlay_instance_${this._id}`);
        $cover.setAttribute('class', `overlay-instance ${styles.mask} ${styles.closed}`);
        // 模态窗
        const $modal = document.createElement('div');
        $modal.setAttribute('class', `${styles.modal}`);
        // 模态窗的标题
        const $title = document.createElement('div');
        $title.setAttribute('class', `${styles.title}`);
        $title.textContent = String(this._options.title);
        // 模态窗的内容
        const $content = document.createElement('div');
        $content.setAttribute('class', `${styles.content}`);
        if (this._options.flag_html_as_content) {
            try {
                $content.innerHTML = String(this._options.content)
            } catch (e) {
                console.error('Error: _options.content is NOT valid HTML string');
                $content.textContent = String(this._options.content)
            }
        } else {
            $content.textContent = String(this._options.content)
        }
        // 模态窗的按钮组
        const html_str = `<button class="btn cancel">${this._options.text_cancel}</button>
                          <button class="btn confirm primary">${this._options.text_confirm}</button>
                         `;
        const $buttons = document.createElement('div');
        $buttons.setAttribute('class', `${styles.buttonContainer}`);
        $buttons.innerHTML = html_str;
        // 生成子树
        $modal.append($title, $content, $buttons);
        $cover.append($modal);
        //
        fragment.append($cover);
        return fragment
    }

    // mount an <overlay/> instance to body
    mount(fragment) {
        if (!this._isMounted) {
            document.body.append(fragment);
            this._isMounted = true;
            this._mountNode = document.querySelector(`#overlay_instance_${this._id}`)
        }
    }

    // 响应组件内部按钮click
    bindEvents() {
        if (this._mountNode) {
            ['confirm', 'cancel'].forEach(__ => {
                document.querySelector(`#overlay_instance_${this._id} .btn.${__}`).addEventListener('click', () => {
                    this.close();
                    if (typeof this._options[`callback_${__}`] === 'function') {
                        return this._options[`callback_${__}`]()
                    }
                });
            });
        }
    }

    // reveal overlay
    open() {
        console.log('open');
        if (this._isMounted) {
            // overrides siblings' z-index
            const siblings = [...this._mountNode.parentNode.childNodes];
            console.log(`siblings: `, siblings);
            let record = 0;
            siblings.forEach(s => {
                // console.log(window.getComputedStyle(s).getPropertyValue('z-index'))
                const v = Number(window.getComputedStyle(s).getPropertyValue('z-index'));
                if (v > record) {
                    record = v
                }
            });
            console.log(record + 1);
            this._mountNode.style.zIndex = `${record + 1}`;
            this._mountNode.classList.remove(`${styles.closed}`);
            if (this._options.flag_lock_page_scroll) {
                // lock body scrolling
                document.body.classList.add(`${styles.noOverflow}`)
            }
        }
    }

    // close overlay
    close() {
        console.log('close');
        if (this._isMounted) {
            this._mountNode.classList.add(`${styles.closed}`);
            this._mountNode.style.zIndex = '0';
            if (this._options.flag_lock_page_scroll) {
                // unlock body scrolling
                document.body.classList.remove(`${styles.noOverflow}`)
            }
        }
    }
}

export default Overlay
