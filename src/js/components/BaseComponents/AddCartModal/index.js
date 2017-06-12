/**
 * Created by Ben on 2017/2/16.
 */
import React, {Component} from 'react'
import styles from './index.scss'
import {DataUtil, urlApi, fetchApi, Constant} from 'service'
import {Loading} from 'components'
import {Toast} from 'antd-mobile'
import {is, fromJS} from 'immutable';

class AddCartModal extends Component {

  constructor(props) {
    super(props);
    this.animationEnd = this.animationEnd.bind(this);
    this.attributes = props.attributes;
    this.stocks = props.stocks;
    this.state = {
      isShow: false,
      animationType: 'leave',
      attributes: this.attributes,
      selectedTemp: {},
      count: 0,
      price: '',
      picture: '',
      productId: '',
      skuId: '',
      quantity: 1,
      name: '',
      storeId: '',
      submitalbe: false,
      activityId: null,
      activityType: null,
    };
    this.skuResult = this.initSKU();
  }

  componentDidMount() {
    const {data} = this.props;
    this.initData(data);
    this.skuHandler()
  }

  componentWillReceiveProps(nextProps) {
    if (!is(fromJS(this.props.attributes), fromJS(nextProps.attributes)) || !is(fromJS(this.props.stocks), fromJS(nextProps.stocks))) {
      console.log(nextProps)
      this.attributes = nextProps.attributes;
      this.stocks = nextProps.stocks;
      this.setState({attributes: nextProps.attributes});
      this.skuResult = this.initSKU();
      this.initData(nextProps.data);
    }
    if (!this.props.visible && nextProps.visible) {
      this.enter();
    } else if (this.props.visible && !nextProps.visible) {
      this.leave();
    }
  }

  initData(data) {
    if (data) {
      this.setState({
        originPrice: data.originPrice,
        price: data.price,
        count: parseInt(data.stock),
        productId: data.productId,
        picture: data.picture,
        productPicture: data.picture,
        storeId: data.storeId,
        storeName: data.storeName,
        name: data.name,
      });
    }
  }

  getFlagArrs = (m, n) => {
    if (!n || n < 1) {
      return [];
    }
    const resultArrs = [];
    const flagArr = [];
    let isEnd = false;
    let leftCnt;
    for (let i = 0; i < m; i++) {
      flagArr[i] = i < n ? 1 : 0;
    }
    resultArrs.push(flagArr.concat());
    while (!isEnd) {
      leftCnt = 0;
      for (let i = 0; i < m - 1; i++) {
        if (flagArr[i] === 1 && flagArr[i + 1] === 0) {
          for (let j = 0; j < i; j++) {
            flagArr[j] = j < leftCnt ? 1 : 0;
          }
          flagArr[i] = 0;
          flagArr[i + 1] = 1;
          const aTmp = flagArr.concat();
          resultArrs.push(aTmp);
          if (aTmp.slice(-n).join('').indexOf('0') === -1) {
            isEnd = true;
          }
          break;
        }
        flagArr[i] === 1 && leftCnt++;
      }
    }
    return resultArrs;
  }

  arrayCombine = (targetArr) => {
    if (!targetArr || !targetArr.length) {
      return [];
    }
    const len = targetArr.length;
    const resultArrs = [];
    for (let n = 1; n < len; n++) {
      const flagArrs = this.getFlagArrs(len, n);
      while (flagArrs.length) {
        const flagArr = flagArrs.shift();
        const combArr = targetArr.reduce((combArr, m, index) => {
          flagArr[index] && combArr.push(m);
          return combArr;
        }, []);
        resultArrs.push(combArr);
      }
    }
    return resultArrs;
  }

  // 字典查询 字典生成
  initSKU = () => {
    if (this.stocks) {
      const data = this.stocks.reduce((obj, item) => {
        const object = Object.assign({}, obj);
        const total = item.attribute.reduce((arr, m) => {
          arr.push(m.childAttr.id);
          return arr;
        }, []);
        total.sort((value1, value2) => value1.localeCompare(value2));
        object[total.join(';')] = Object.assign({}, item);
        return object;
      }, {});
      const SKUResult = {};

      // const skuKeys = Object.keys(data).map((key) => key);
      // 需要剔除count为 0 的库存
      const skuKeys = Object.keys(data).reduce((arr, key) => {
        if (data[key].count > 0) {
          arr.push(key);
        }
        return arr;
      }, []);

      const _this = this;
      skuKeys.forEach((skuKey) => {
        const sku = data[skuKey];
        const skuKeyAttrs = skuKey.split(';');
        const combArr = _this.arrayCombine(skuKeyAttrs);
        for (let j = 0; j < combArr.length; j++) {
          const key = combArr[j].join(';');
          if (SKUResult[key]) {
            SKUResult[key].count += sku.count;
            SKUResult[key].prices.push(sku.price);
            SKUResult[key].picture.push(sku.picture);
            sku.activityId && SKUResult[key].activityId.push(sku.activityId);
            sku.activityType && SKUResult[key].activityType.push(sku.activityType);
          } else {
            SKUResult[key] = {
              count: sku.count,
              prices: [sku.price],
              id: [sku.id],
              picture: [sku.picture]
            };
            if (sku.activityId) SKUResult[key].activityId = [sku.activityId];
            if (sku.activityType) SKUResult[key].activityType = [sku.activityType]
          }
        }
        SKUResult[skuKey] = {
          count: sku.count,
          prices: [sku.price],
          id: [sku.id],
          picture: [sku.picture]
        };
        if (sku.activityId) SKUResult[skuKey].activityId = [sku.activityId];
        if (sku.activityType) SKUResult[skuKey].activityType = [sku.activityType]
      });
      return SKUResult;
    } else {
      return '';
    }
  }

  // 处理sku数据
  skuHandler = () => {
    const selectedTemp = this.state.selectedTemp || {};
    const attributes = this.state.attributes;
    const skuResult = this.skuResult;
    const nextState = {};
    // 根据已选中的selectedTemp，生成字典查询selectedIds
    const selectedIds = Object.keys(selectedTemp).reduce((arr, m) => {
      if (selectedTemp[m]) {
        arr.push(selectedTemp[m].id);
      }
      return arr;
    }, []);
    selectedIds.sort((value1, value2) => value1.localeCompare(value2));

    // 处理attributes数据，根据字典查询结果计算当前选择情况的价格范围以及总数量。
    // 并添加selected属性，用于render判断。
    if (attributes) {
      attributes.forEach((m) => {
        let selectedObjId;
        m.childAttr.forEach((a) => {
          a.selected = !!(selectedTemp[m.title] && selectedTemp[m.title].id === a.id);
          if (!a.selected) {
            let testAttrIds = [];
            if (selectedTemp[m.title]) {
              selectedObjId = selectedTemp[m.title].id;
              for (let i = 0; i < selectedIds.length; i++) {
                (selectedIds[i] !== selectedObjId) && testAttrIds.push(selectedIds[i]);
              }
            } else {
              testAttrIds = selectedIds.concat();
            }
            testAttrIds = testAttrIds.concat(a.id);
            testAttrIds.sort((value1, value2) => value1.localeCompare(value2));
            a.unselectable = !skuResult[testAttrIds.join(';')];
          }
        });
      });
      nextState.submitalbe = false;
      if (skuResult[selectedIds.join(';')]) {
        const prices = skuResult[selectedIds.join(';')].prices;
        const max = Math.max.apply(Math, prices).toFixed(2);
        const min = Math.min.apply(Math, prices).toFixed(2);
        nextState.price = max === min ? max : `${min} - ${max}`;
        if (selectedIds.length === attributes.length) {
          if (attributes.length === 1) {
            nextState.quantity = 1;
          }
          nextState.submitalbe = true;
          nextState.price = skuResult[selectedIds.join(';')].prices[0].toFixed(2);
          if (skuResult[selectedIds.join(';')].activityId && skuResult[selectedIds.join(';')].activityType) {
            nextState.activityId = skuResult[selectedIds.join(';')].activityId[0];
            nextState.activityType = skuResult[selectedIds.join(';')].activityType[0];
          }
          if (skuResult[selectedIds.join(';')].picture.length === 1) {
            nextState.picture = skuResult[selectedIds.join(';')].picture[0] ? skuResult[selectedIds.join(';')].picture[0] : this.state.picture
          }
        } else {
          nextState.activityId = null;
          nextState.activityType = null;
          nextState.quantity = 1;
          nextState.picture = this.state.productPicture;
        }
        nextState.count = skuResult[selectedIds.join(';')].count;
        nextState.skuId = skuResult[selectedIds.join(';')].id[0];
      } else {
        nextState.count = this.stocks.reduce((count, item) => count + item.count, 0);
        nextState.quantity = 1;
      }
      Object.keys(nextState).length > 0 && this.setState(nextState);
    }
  }

  clickHandler(item) {
    const attributes = this.state.attributes;
    const selectedTemp = this.state.selectedTemp;

    attributes.forEach((info) => {
      if (selectedTemp[info.title] && selectedTemp[info.title].id === item.id) {
        selectedTemp[info.title] = null;
      } else {
        info.childAttr.forEach((c) => {
          if (c.id === item.id) {
            c.selected = false;
            selectedTemp[info.title] = {};
            selectedTemp[info.title].title = c.title;
            selectedTemp[info.title].id = c.id;
          }
        });
      }
    });

    this.setState({
      selectedTemp,
    });

    this.skuHandler();
  }

  enter() {
    this.setState({
      isShow: true,
      animationType: 'enter'
    });
  }

  leave() {
    this.setState({
      animationType: 'leave',
      selectedTemp: {},
      submitalbe: false,
      activityId: null,
      activityType: null,
    })
  }

  animationEnd() {
    if (this.state.animationType === 'leave') {
      this.setState({
        isShow: false
      });
    }
    if (this.state.animationType === 'enter') {
      this.skuHandler();
    }
  }

  desQuantity = () => {
    if (!this.state.submitalbe) return;
    this.setState({
      quantity: this.state.quantity - 1
    })
  }

  addQuantity = () => {
    if (!this.state.submitalbe) return;
    this.setState({
      quantity: this.state.quantity + 1
    })
  }

  addCart = () => {
    const {price, skuId, quantity, activityId, activityType, storeId} = this.state;
    let mobilePhone = JSON.parse(localStorage.userInfo).mobile;
    let params = {activityId, activityType, mobilePhone, skuId, price, quantity, storeId};
    this.props.action.addCart(params);
  }

  render() {
    const {animationType, isShow, attributes, count, price, picture, name, quantity, submitalbe, activityType} = this.state;
    const {onClose} = this.props;
    const style = {
      display: isShow ? '' : 'none',
      WebkitAnimationDuration: '300ms',
      animationDuration: '300ms'
    }

    return (
      <div className={`${styles.fixBg} rodal-fade-${animationType}`} style={style}
           onAnimationEnd={this.animationEnd}>
        <div className={styles.mask} onClick={onClose} />
        <div className={`${styles.modal} rodal-zoom-${animationType}`}>
          <div className={`ver-center ${styles.header}`}>
            <div className={styles.thumb}>
              <img src={picture} alt=""/>
            </div>
            <div className={styles.detail}>
              <p className={styles.activity}>
                {activityType ? <span className={styles.content}>{Constant.getActivityName(activityType)}</span> : null}
              </p>
              <p className={`text-overflow-one font-24 color333 ${styles.name}`}>{name}</p>
              <p className={`font-20 color8282 ${styles.count}`}>库存:{count}</p>
            </div>
          </div>
          <div className={styles.content}>
            {
              attributes.length && attributes.map((attribute, i) =>
                <div className={styles.attr} key={i}>
                  <span className="font-24 color5b5b">请选择{attribute.title}:</span>
                  <ul className={styles.skuPanel}>
                    {
                      attribute.childAttr.map((item, o) => {
                          const buttonType = item.selected ? styles.selected : styles.normal;
                          if (item.unselectable) {
                            return <li className={styles.none} disabled key={o}><span
                              className="font-24 color5b5b">{item.title}</span></li>;
                          }
                          return <li className={buttonType}
                                     onClick={ () => this.clickHandler(item) } key={o}><span
                            className="font-24 color5b5b">{item.title}</span></li>

                        }
                      )
                    }
                  </ul>
                </div>
              )
            }
            <p className="font-24 color5b5b">请选择数量:</p>
            <div className={styles.numCtrl}>
              {
                quantity === 1 ?
                  <div className={`center-center ${styles.des}`} disabled>
                    <img
                      src={require('../../../../images/cart/car_count_icon_minus_lowlighted.png')}
                      alt=""/>
                  </div>
                  :
                  <div className={`center-center ${styles.des}`}
                       onClick={this.desQuantity.bind(this)}>
                    <img
                      src={require('../../../../images/cart/car_count_icon_minus_highlighted.png')}
                      alt=""/>
                  </div>
              }

              <div className={`center-center ${styles.num}`}>
                <span>{quantity}</span>
              </div>
              {
                quantity === parseInt(count) ?
                  <div className={`center-center ${styles.add}`} disabled>
                    <img src={require('../../../../images/cart/car_count_icon_add_lowlighted.png')}
                         alt=""/>
                  </div>
                  :
                  <div className={`center-center ${styles.add}`}
                       onClick={this.addQuantity.bind(this)}>
                    <img src={require('../../../../images/cart/car_count_icon_add_highlighted.png')}
                         alt=""/>
                  </div>
              }

            </div>
          </div>
          <div className={`ver-center ${styles.footer}`}>
            <p className="font-28 color-fe5">价格: ¥{price}</p>
            <div className={`center-center ${styles.addBtn} ${!submitalbe && styles.disabled}`}
                 onClick={() => {
                   if (submitalbe) this.addCart()
                 }}>
              <span className="font-30 color-white">加入购物车</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default AddCartModal