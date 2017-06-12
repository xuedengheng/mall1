/**
 * Created by Ben on 2017/3/10.
 */
import React, {Component} from 'react'
import styles from './index.scss'
import {Toast} from 'antd-mobile'
import {fetchApi,urlApi} from 'service'
import {GoBack, Loading} from 'components'

class SelectAddress extends Component {
    constructor(props) {
        super(props);
        this.animationEnd = this.animationEnd.bind(this);
        this.state = {
            isShow: false,
            isLoading: false,
            animationType: 'leave',
            province: [],
            city: [],
            county: [],
            town: [],
            inprovince: false,
            incity: false,
            incounty: false,
            intown: false,
            selectedProvince: {},
            selectedCity: {},
            selectedCounty: {},
            selectedTown: {}
        }
    }

    componentDidMount() {
        let params = {url: urlApi.address.province};
        fetchApi.get(params).then(result => {
            let province = this.sortData(result.result);
            this.setState({province, inprovince: true})
        }).catch(error => {
            Toast.info(error.message)
        }).then(() => {
            this.setState({isLoading: false})
        })
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.enter();
        } else if (this.props.visible && !nextProps.visible) {
            this.leave();
        }
    }

    enter() {
        this.setState({
            isShow: true,
            animationType: 'enter'
        });
    }

    leave() {
        this.setState({
            animationType: 'leave'
        })
    }

    animationEnd() {
        if (this.state.animationType === 'leave') {
            this.setState({
                isShow: false,
                incity: false,
                incounty: false,
                intown: false,
            });
        }
    }

    getCity = (id, name) => {
        let selected = {id, name};
        this.setState({selectedProvince: selected, isLoading: true})
        let params = {url: urlApi.address.city, search: {id: id}};
        fetchApi.get(params).then(result => {
            if (result.success) {
                let city = this.sortData(result.result);
                this.setState({city, incity: true})
            } else {
                let result = {selectedProvince: selected};
                this.props.setAddress(result)
            }
        }).catch(error => {
            Toast.info(error.message)
        }).then(() => {
            this.setState({isLoading: false})
        })
    }

    getCounty = (id, name) => {
        const {selectedProvince} = this.state;
        let selected = {id, name};
        this.setState({selectedCity: selected, isLoading: true});
        let params = {url: urlApi.address.county, search: {id: id}};
        fetchApi.get(params).then(result => {
            if (result.success) {
                let county = this.sortData(result.result);
                this.setState({county, incounty: true})
            } else {
                let result = {selectedProvince, selectedCity: selected};
                this.props.setAddress(result);
            }
        }).catch(error => {
            Toast.info(error.message)
        }).then(() => {
            this.setState({isLoading: false})
        })
    }

    getTown = (id, name) => {
        const {selectedProvince, selectedCity} = this.state;
        let selected = {id, name};
        this.setState({selectedCounty: selected, isLoading: true});
        let params = {url: urlApi.address.town, search: {id: id}};
        fetchApi.get(params).then(result => {
            if (result.success) {
                let town = this.sortData(result.result);
                this.setState({town, intown: true})
            } else {
                let result = {selectedProvince, selectedCity, selectedCounty: selected};
                this.props.setAddress(result);
            }

        }).catch(error => {
            Toast.info(error.message)
        }).then(() => {
            this.setState({isLoading: false})
        })
    }

    setAddress = (id, name) => {
        const {selectedProvince, selectedCity, selectedCounty} = this.state;
        let selected = {id, name};
        let result = {selectedProvince, selectedCity, selectedCounty, selectedTown: selected};
        this.props.setAddress(result);
    }

    sortData = (data) => {
        let result = [];
        for (let i in data) {
            result.push({id: data[i], name: i})
        }
        result.sort(function (a, b) {
            return a.name.localeCompare(b.name)
        })
        return result;
    }

    backProvince = () => {
        this.setState({incity: false});
    }

    backCity = () => {
        this.setState({incounty: false});
    }

    backcounty = () => {
        this.setState({intown: false});
    }

    render() {
        const {onClose} = this.props;
        const {province, city, county, town, inprovince, incity, incounty, intown, isShow, animationType, isLoading} = this.state;
        const style = {
            display: isShow ? '' : 'none',
            WebkitAnimationDuration: '300ms',
            animationDuration: '300ms'
        }

        return (
            <div className={`z-60 ${styles.selectbox} rodal-popleft-${animationType}`} style={style}
                 onAnimationEnd={this.animationEnd}>
                {
                    isLoading && <Loading />
                }
                <div className={`z-60 ${styles.province} ${inprovince && styles.active}`}>
                    <GoBack name="选择省份" bottom="true" goBack={onClose}/>
                    <div className={styles.wrapper}>
                        <ul>
                            {
                                province.map((item, index) =>
                                    <li className={styles.item} key={index}
                                        onClick={this.getCity.bind(this, item.id, item.name)}>
                                        <span>{item.name}</span><span className={`arrow-right fr ${styles.icon}`}/>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className={`z-70 ${styles.city} ${incity && styles.active}`}>
                    <GoBack name="选择城市" bottom="true" goBack={this.backProvince}/>
                    <div className={styles.wrapper}>
                        <ul>
                            {
                                city.map((item, index) =>
                                    <li className={styles.item} key={index}
                                        onClick={this.getCounty.bind(this, item.id, item.name)}>
                                        <span>{item.name}</span><span className={`arrow-right fr ${styles.icon}`}/>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className={`z-80 ${styles.county} ${incounty && styles.active}`}>
                    <GoBack name="选择区县" bottom="true" goBack={this.backCity}/>
                    <div className={styles.wrapper}>
                        <ul>
                            {
                                county.map((item, index) =>
                                    <li className={styles.item} key={index}
                                        onClick={this.getTown.bind(this, item.id, item.name)}>
                                        <span>{item.name}</span><span className={`arrow-right fr ${styles.icon}`}/>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className={`z-90 ${styles.town} ${intown && styles.active}`}>
                    <GoBack name="选择乡镇" bottom="true" goBack={this.backcounty}/>
                    <div className={styles.wrapper}>
                        <ul>
                            {
                                town.map((item, index) =>
                                    <li className={styles.item} key={index}
                                        onClick={this.setAddress.bind(this, item.id, item.name)}>
                                        <span>{item.name}</span><span className={`arrow-right fr ${styles.icon}`}/>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
export default SelectAddress