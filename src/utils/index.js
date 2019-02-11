/**
 * @description 获取某个区间[min=0, max]的随机数
 * @param {number} max - 区间最大值
 * @param {number} min - 区间最小值,默认为0
 * @param {bool} int - 是否为整数,默认为true,即整数
 */
export const generateRandom = (max, min = 0, int = true) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const res = Math.random() * (max - min + 1) + min;
  return int ? Math.floor(res) : res;
};

/**
 * @description 随机打乱数组
 * @param {array} arr - 要打乱的原数组
 * @returns 返回打乱后的新数组
 */
export const shuffle = arr => {
  const newArr = [...arr];
  let m = newArr.length,
    i;
  while (m) {
    i = (Math.random() * m--) >>> 0;
    [newArr[m], newArr[i]] = [newArr[i], newArr[m]];
  }
  return newArr;
};

/**
 * @desc react高阶组件, 用于给组件key,(nextProp != this.props时)更新渲染
 * @param {string} per - 指定 per(可选) 为组件的key, 否则默认当前的url
 */
export const viewHoc = per => {
  return ChildComponent => {
    /* class Hoc extends Component {
			// displayName 静态属性,保留原组件的名称,利于debug
			static displayName = `Hoc${ChildComponent.displayName || ChildComponent.name || 'Component'}`

			render() {
				let key = per ? props[per] : props.match.url
				return <ChildComponent key={String(key)} {...props} />
			}
		} */
    let Hoc = props => {
      // console.log(props)
      let key = per ? props[per] : props.match.url;
      return <ChildComponent key={String(key)} {...props} />;
    };
    // displayName 静态属性,保留原组件的名称,利于debug
    Hoc.displayName = `Hoc${ChildComponent.displayName || ChildComponent.name || 'Component'}`;

    return Hoc;
  };
};
