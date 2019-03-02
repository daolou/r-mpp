// 映射数据类型
const map2DataType = {
  '[object String]': 'String',
  '[object Number]': 'Number',
  '[object Undefined]': 'Undefined',
  '[object Boolean]': 'Boolean',
  '[object Array]': 'Array',
  '[object Function]': 'Function',
  '[object Object]': 'Object',
  '[object Symbol]': 'Symbol',
  '[object Set]': 'Set',
  '[object Map]': 'Map',
  '[object WeakSet]': 'WeakSet',
  '[object WeakMap]': 'WeakMap',
  '[object Null]': 'Null',
  '[object Promise]': 'Promise',
  '[object NodeList]': 'NodeList',
  '[object Date]': 'Date',
};
/**
 * @desc 判断数据的具体类型
 * @param {any} o - 要判断的数据
 */
export const dataType = o => {
  let r = Object.prototype.toString.call(o);
  if (map2DataType[r]) {
    return map2DataType[r];
  } else {
    // return r.replace('[object ', '').replace(']', '')
    return r.replace(/^\[object\s(.*)\]$/, '$1');
  }
  // return Object.prototype.toString.call(o).replace('[object ', '').replace(']', '')
};
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
 * @description 在数字后面加上st/nd/rd/th
 * @param {number} i - 数字
 * @param {bool} lower - 是否小写,默认:是
 */
export const ordinalSuffixOf = (i, lower = true) => {
  let j = i % 10,
    k = i % 100,
    res = 'th';
  if (j == 1 && k != 11) {
    res = 'st';
  }
  if (j == 2 && k != 12) {
    res = 'nd';
  }
  if (j == 3 && k != 13) {
    res = 'rd';
  }
  return i + (lower ? res : res.toUpperCase());
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

/**
 * @description 将css转为驼峰对象
 * @param {string} str - css字符串
 * @param {object} opt - px2rem,
 * @returns obj - 返回驼峰对象
 */
export const css2obj = (str, opt = {}) => {
  const obj = {};
  opt = Object.assign({ rem: false, unit: 100, fixed: 2 }, opt);
  // 去除;后面空格/回车/制表符
  str = str.replace(/;(\s|\r|\t)*/g, ';');
  // ;分割css属性
  const arr1 = str.split(';');
  // 去除最后一位空值
  arr1.pop();
  // 遍历得到的数组
  arr1.forEach(item => {
    // :分割得到['属性:属性值']
    const arr2 = item.split(':');
    // 将属性转为驼峰
    const key = arr2[0].replace(/-(\w)/g, (k, r) => r.toUpperCase());
    let value = arr2[1];
    if (opt.rem) {
      const reg = /\b(\d+(\.\d+)?)PX\b/gi;
      // 先test下有没有符合的如果有再进行替换
      if (reg.test(value)) {
        value.replace(reg, (k, r) => {
          let val = r / opt.unit;
          // 精确到几位
          val = parseFloat(val.toFixed(opt.fixed));
          return val === 0 ? val : val + 'rem';
        });
      }
    }
    // 合并到对象
    Object.assign(obj, { [key]: value });
  });
  return obj;
};
