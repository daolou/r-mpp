import React, { PureComponent } from 'react';
import CountdownBolb from '~src/worker/countdown';
import classnames from 'classnames/bind';
import styles from './index.less';
const cx = classnames.bind(styles);

export const transfDate = (second: number): (number | string)[] => {
  if (second < 0) {
    return ['--', '--', '--', '--'];
  }
  const DD = second / (24 * 60 * 60);
  const HH = (second % (24 * 60 * 60)) / (60 * 60);
  const mm = ((second % (24 * 60 * 60)) % (60 * 60)) / 60;
  const ss = ((second % (24 * 60 * 60)) % (60 * 60)) % 60;

  return [DD, HH, mm, ss].map((item) => {
    item = Math.floor(item);
    if (item < 10) {
      return `0${item}`;
    }
    return item;
  });
};

export type TStatus = 'not_start' | 'start' | 'end' | 'offline';

export interface IProps {
  /* 倒计时 初始 剩余秒数 */
  initial_second: number;

  wrapperStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;

  /* 倒计时状态 */
  status: TStatus;
  replaceTxt: Record<TStatus, string>;
}

interface IState {
  remain_second: number;
}

export default class CountDown extends PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      remain_second: props.initial_second || 0,
    };
  }
  static defaultProps = {
    status: 'start',
    replaceTxt: {
      not_start: 'Not start yet',
      start: '',
      end: 'Already end',
      offline: 'Already offline',
    },
  };
  _worker = new Worker(CountdownBolb);
  runTime = (): void => {
    // 使用 web worker 解决直接使用setInterval的触摸滑动时渲染卡顿问题
    const { remain_second } = this.state;
    this._worker.postMessage(remain_second);
    this._worker.onmessage = (event) => {
      const s = event.data;
      this.setState({ remain_second: s });
    };
  };
  componentDidMount() {
    this.props.status === 'start' && this.runTime();
  }
  componentWillUnmount() {
    // 传入0，清楚定时器并关闭worker
    this._worker?.postMessage(0);
  }
  render() {
    const { wrapperStyle, iconStyle, status, replaceTxt } = this.props;
    const { remain_second } = this.state;
    const [DD, HH, mm, ss] = transfDate(remain_second);
    return (
      <div className={cx('countdown')} style={wrapperStyle}>
        <span className={cx('icon')} style={iconStyle} />
        <span style={{ width: '6px' }} />
        {status === 'start' ? (
          <>
            <span className={cx('num')}>{DD}</span> Day
            <span className={cx('num')}>{HH}</span> h<span className={cx('num')}>{mm}</span> m
            <span className={cx('num')}>{ss}</span> s
          </>
        ) : (
          replaceTxt[status]
        )}
      </div>
    );
  }
}
