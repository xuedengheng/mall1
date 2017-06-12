/**
 * Created by Ben on 2017/3/7.
 */
import React, {Component} from 'react'
import {api, DataUtil} from 'service'
import styles from './index.scss'
import {Constant} from 'service'

const ADDCART = 0;
const BUY = 1;

class ProductModal extends Component {

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
      selectedAttr: '',
      count: 0,
      price: '',
      originPrice: '',
      productId: '',
      productPicture: '',
      picture: '',
      skuId: '',
      quantity: 1,
      storeId: '',
      storeName: '',
      name: '',
      activityId: null,
      activityType: null,
      submitalbe: false
    };
    this.skuResult = this.initSKU();
  }

  componentDidMount() {
    const {data} = this.props;
    this.initData(data)
  }

  componentWillReceiveProps(nextProps) {

    this.attributes = nextProps.attributes;
    this.stocks = nextProps.stocks;
    this.setState({attributes: nextProps.attributes});
    this.skuResult = this.initSKU();
    this.initData(nextProps.data);
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
      this.skuHandler()
    }
  }

  getFlagArrs(m, n) {
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

  arrayCombine(targetArr) {
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
  initSKU() {
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
            SKUResult[key].originPrice.push(sku.originPrice);
            SKUResult[key].picture.push(sku.picture);
            sku.activityId && SKUResult[key].activityId.push(sku.activityId);
            sku.activityType && SKUResult[key].activityType.push(sku.activityType);
          } else {
            SKUResult[key] = {
              count: sku.count,
              prices: [sku.price],
              originPrice: [sku.originPrice],
              id: [sku.id],
              picture: [sku.picture],
            };
            if (sku.activityId) SKUResult[key].activityId = [sku.activityId];
            if (sku.activityType) SKUResult[key].activityType = [sku.activityType]
          }
        }
        SKUResult[skuKey] = {
          count: sku.count,
          prices: [sku.price],
          originPrice: [sku.originPrice],
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
  skuHandler() {
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
          nextState.selectedAttr = selectedIds.join(' ');
          nextState.submitalbe = true;
          nextState.price = skuResult[selectedIds.join(';')].prices[0].toFixed(2);
          nextState.originPrice = skuResult[selectedIds.join(';')].originPrice[0].toFixed(2);
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
        nextState.activityId = null;
        nextState.activityType = null;
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
      quantity: 1,
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
      this.skuHandler();
    }
  }

  desQuantity = () => {
    if (!this.state.submitalbe) return
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

  submit = (type) => {
    const {storeId, storeName, activityType, activityId, picture, name, selectedAttr, productId, skuId, quantity, price, originPrice} = this.state;
    let params;
    if (type === BUY) {
      params = {
        status: 'product',
        data: [{
          storeId,
          storeName,
          skuPrices: [{
            activityType,
            activityId,
            productId,
            picture,
            name,
            selectedAttr,
            skuId,
            quantity,
            price,
            originPrice
          }]
        }]
      }
    } else if (type === ADDCART) {
      params = {
        mobilePhone: localStorage.account,
        price,
        quantity,
        skuId,
        storeId,
        activityType,
        activityId
      }
    }
    this.props.submit(params, type)
  }

  render() {
    const {close, type} = this.props;
    const {animationType, isShow, attributes, count, price, picture, quantity, name, submitalbe, activityType} = this.state;
    const style = {
      display: isShow ? '' : 'none',
      WebkitAnimationDuration: '300ms',
      animationDuration: '300ms'
    }

    return (
      <div className={`${styles.root} rodal-fade-${animationType}`} style={style}
           onAnimationEnd={this.animationEnd}>
        <div className={styles.mask} onClick={close.bind(this)}/>
        <div className={`${styles.container} rodal-popup-${animationType}`}>
          <div className={styles.header}>
            <div className={styles.avator}>
              <img className="img-responsive" src={picture} alt=""/>
            </div>
            <div className={styles.detail}>
              <p className={styles.price}>
                ¥{price}
                {
                  activityType ?
                    <span className={styles.label}>{Constant.getActivityName(activityType)}</span> : null
                }
              </p>
              <p className={styles.stock}>库存：{count}</p>
              <p className={`${styles.name} text-overflow-one`}>{name}</p>
            </div>
          </div>
          <div className={styles.content}>
            {
              (attributes && attributes.length > 0) &&
              <div className={styles.attrPanel}>
                {
                  attributes.map((attribute, i) =>
                    <div className={styles.attr} key={i}>
                      <p className="font-28 mb20">选择{attribute.title}</p>
                      <ul className={styles.skuPanel}>
                        {
                          attribute.childAttr.map((item, o) => {
                              const buttonType = item.selected ? styles.selected : styles.normal;
                              if (item.unselectable) {
                                return <li className={styles.none} disabled key={o}><span
                                  className="font-24 color5b5b">{item.title}</span></li>;
                              }
                              return <li className={buttonType}
                                         onClick={ () => this.clickHandler(item) }
                                         key={o}><span
                                className="font-24 color5b5b">{item.title}</span></li>
                            }
                          )
                        }
                      </ul>
                    </div>
                  )
                }
              </div>
            }
            <div className={styles.countControl}>
              <p className="font-28">购买数量</p>
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
                      <img
                        src={require('../../../../images/cart/car_count_icon_add_lowlighted.png')}
                        alt=""/>
                    </div>
                    :
                    <div className={`center-center ${styles.add}`}
                         onClick={this.addQuantity.bind(this)}>
                      <img
                        src={require('../../../../images/cart/car_count_icon_add_highlighted.png')}
                        alt=""/>
                    </div>
                }

              </div>
            </div>
          </div>
          <div className={`${styles.footer} ${!submitalbe && styles.disabled}`}
               onClick={() => {
                 if (submitalbe) this.submit(type)
               }}>
            {type === ADDCART ? '加入购物车' : '立即购买'}
          </div>
        </div>
      </div>
    )
  }
}
export default ProductModal;