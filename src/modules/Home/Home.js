import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {compose} from "redux";
import {connect, useSelector} from "react-redux";
import commonApi from "../../api/commonApi";
import {withStyles} from "@mui/styles";
import {Link, withRouter} from "react-router-dom";
import {useTranslation} from "react-i18next";
import EquipmentIcon from "../../assets/images/equipment.png";
import ProjectIcon from "../../assets/images/project.png";
import ProductIcon from "../../assets/images/product.png";
import ClientIcon from "../../assets/images/client.png";
import EmployeeIcon from "../../assets/images/employee.png";
import InvoiceIcon from "../../assets/images/invoice.png";
import TransportOrderIcon from "../../assets/images/transport.png";
import GpsRouteIcon from "../../assets/images/route.png";
import VehicleIcon from "../../assets/images/vehicle.png";
import * as links from "../../constants/links";
import {Col, DatePicker, Row, Spin} from "antd";
import {ROLE_ADMIN, ROLE_SUPERADMIN} from "../../constants/constants";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import i18n from "../../i18n";
import invoiceApi from "../../api/invoiceApi";
import moment from "moment";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const styles = {
    blockWrapper: {
        padding: 10,
    },
    blockModule: {
        backgroundColor: '#bed5f9',
        borderRadius: 13,
        height: '100%',
        display: 'block',
        '& .itemModule': {
            display: 'flex',
            alignItems: 'center',
            padding: 10,
            '& .itemModuleTitle': {
                padding: 5,
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                '& img': {
                    width: 60,
                },
                '& .itemModuleTitleText': {
                    color: '#002140',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: 0.9
                }
            },
            '& .itemModuleCount': {
                margin: 5,
                color: '#fff',
                padding: '2px 5px',
                backgroundColor: '#002140',
                borderRadius: '50%',
                fontWeight: 'bold',
            }
        }
    },
    homeEmployee: {},
    chartWrapper: {
        maxWidth: 800,
        margin: 'auto'
    },
    selectYearWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}

const dataInitStatisCount = {
    vehicle: null,
    productType: null,
    product: null,
    projectType: null,
    project: null,
    equipmentType: null,
    equipment: null,
    client: null,
    invoice: null,
    transportOrder: null,
    person: null,
    gpsRoute: null
}
const listMonths = [0,1,2,3,4,5,6,7,8,9,10,11]
const Home = (props) => {
    const {
        classes
    } = props;
    const {
        dataUser
    } = useSelector(state => state.authReducer);
    const {t} = useTranslation();
    const [year, setYear] = useState(moment());
    const [loading, setLoading] = useState(false);
    const [dataTotalAmount, setDataTotalAmount] = useState(listMonths.map(item => 0));
    const isAdmin = [ROLE_ADMIN, ROLE_SUPERADMIN].includes(dataUser?.data?.role);
    const [statisCount, setStatisCount] = useState({...dataInitStatisCount})

    useEffect(() => {
        getDataStatis();
    }, [])

    useEffect(() => {
        getTotalAmountByYear(year.year());
    }, [year])

    const getDataStatis = async () => {
        const res = await commonApi.showStatis();
        if (res.status === 200) {
            setStatisCount(prev => ({
                ...prev,
                ...res.data?.count
            }))
        }
    }

    const getTotalAmountByYear = async (year) => {
        setLoading(true);
        const res = await invoiceApi.getTotalAmountByYear(year);
        if (res.status === 200) {
            if (res.data.total) {
                setDataTotalAmount(listMonths.map(item => Number((res.data.total[item] ?? 0))))
            }
        }
        setLoading(false)
    }
    const showEquipmentBlock = () => {
        return (
            <Col item xs={24} sm={24} md={12} lg={8} className={classes.blockWrapper}>
                <Link
                    className={classes.blockModule}
                    to={links.EQUIPMENT_LIST}
                >
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <img src={EquipmentIcon} alt=""/>
                            <div className="itemModuleTitleText">
                                {t('module.equipment')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.equipment === null ? "" : statisCount?.equipment ?? ""}
                        </div>
                    </div>
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <div className="itemModuleTitleText">
                                {t('module.equipmentType')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.equipmentType === null ? "" : statisCount?.equipmentType ?? ""}
                        </div>
                    </div>
                </Link>
            </Col>
        )
    }
    const showProjectBlock = () => {
        return (
            <Col item xs={24} sm={24} md={12} lg={8} className={classes.blockWrapper}>
                <Link
                    className={classes.blockModule}
                    to={links.PROJECT_LIST}
                >
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <img src={ProjectIcon} alt=""/>
                            <div className="itemModuleTitleText">
                                {t('module.project')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.project === null ? "" : statisCount?.project ?? ""}
                        </div>
                    </div>
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <div className="itemModuleTitleText">
                                {t('module.projectType')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.projectType === null ? "" : statisCount?.projectType ?? ""}
                        </div>
                    </div>
                </Link>
            </Col>
        )
    }
    const showProductBlock = () => {
        return (
            <Col item xs={24} sm={24} md={12} lg={8} className={classes.blockWrapper}>
                <Link
                    className={classes.blockModule}
                    to={links.PRODUCT_LIST}
                >
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <img src={ProductIcon} alt=""/>
                            <div className="itemModuleTitleText">
                                {t('module.product')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.product === null ? "" : statisCount?.product ?? ""}
                        </div>
                    </div>
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <div className="itemModuleTitleText">
                                {t('module.productType')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.productType === null ? "" : statisCount?.productType ?? ""}
                        </div>
                    </div>
                </Link>
            </Col>
        )
    }
    const showClientBlock = () => {
        return (
            <Col item xs={24} sm={24} md={12} lg={8} className={classes.blockWrapper}>
                <Link
                    className={classes.blockModule}
                    to={links.CLIENT_LIST}
                >
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <img src={ClientIcon} alt=""/>
                            <div className="itemModuleTitleText">
                                {t('module.client')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.client === null ? "" : statisCount?.client ?? ""}
                        </div>
                    </div>
                </Link>
            </Col>
        )
    }
    const showEmployeeBlock = () => {
        return (
            <Col item xs={24} sm={24} md={12} lg={8} className={classes.blockWrapper}>
                <Link
                    className={classes.blockModule}
                    to={links.EMPLOYEE_LIST}
                >
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <img src={EmployeeIcon} alt=""/>
                            <div className="itemModuleTitleText">
                                {t('module.employee')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.person === null ? "" : statisCount?.person ?? ""}
                        </div>
                    </div>
                </Link>
            </Col>
        )
    }
    const showInvoiceBlock = () => {
        return (
            <Col item xs={24} sm={24} md={12} lg={8} className={classes.blockWrapper}>
                <Link
                    className={classes.blockModule}
                    to={links.INVOICE_LIST}
                >
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <img src={InvoiceIcon} alt=""/>
                            <div className="itemModuleTitleText">
                                {t('module.invoice')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.invoice === null ? "" : statisCount?.invoice ?? ""}
                        </div>
                    </div>
                </Link>
            </Col>
        )
    }
    const showTransportOrderBlock = () => {
        return (
            <Col item xs={24} sm={24} md={12} lg={8} className={classes.blockWrapper}>
                <Link
                    className={classes.blockModule}
                    to={links.TRANSPORT_ORDER_LIST}
                >
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <img src={TransportOrderIcon} alt=""/>
                            <div className="itemModuleTitleText">
                                {t('module.transportOrder')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.transportOrder === null ? "" : statisCount?.transportOrder ?? ""}
                        </div>
                    </div>
                </Link>
            </Col>
        )
    }
    const showGpsRouteBlock = () => {
        return (
            <Col item xs={24} sm={24} md={12} lg={8} className={classes.blockWrapper}>
                <Link
                    className={classes.blockModule}
                    to={links.GPS_ROUTE}
                >
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <img src={GpsRouteIcon} alt=""/>
                            <div className="itemModuleTitleText">
                                {t('module.gpsRoute')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.gpsRoute === null ? "" : statisCount?.gpsRoute ?? ""}
                        </div>
                    </div>
                </Link>
            </Col>
        )
    }
    const showVehicleBlock = () => {
        return (
            <Col item xs={24} sm={24} md={12} lg={8} className={classes.blockWrapper}>
                <Link
                    className={classes.blockModule}
                    to={links.VEHICLE_LIST}
                >
                    <div className="itemModule">
                        <div className="itemModuleTitle">
                            <img src={VehicleIcon} alt=""/>
                            <div className="itemModuleTitleText">
                                {t('module.vehicle')}
                            </div>
                        </div>
                        <div className="itemModuleCount">
                            {statisCount?.vehicle === null ? "" : statisCount?.vehicle ?? ""}
                        </div>
                    </div>
                </Link>
            </Col>
        )
    }
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: t('home.label.revenue_statistics') + " (VND)",
            },
        },
    };
    const labels = [
        t('label.month.m_1'),
        t('label.month.m_2'),
        t('label.month.m_3'),
        t('label.month.m_4'),
        t('label.month.m_5'),
        t('label.month.m_6'),
        t('label.month.m_7'),
        t('label.month.m_8'),
        t('label.month.m_9'),
        t('label.month.m_10'),
        t('label.month.m_11'),
        t('label.month.m_12'),
    ];
    const data = {
        labels,
        datasets: [
            {
                label: t('home.label.revenue'),
                data: dataTotalAmount,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    if (isAdmin) {
        return (
            <Row>
                <Col xs={24}>
                    <div className={classes.selectYearWrapper}>
                        <DatePicker
                            value={year}
                            picker="year"
                            bordered={false}
                            onChange={(value) => {
                                setYear(value)
                            }}
                        />
                    </div>
                </Col>
                <Col xs={24}>
                    <div className={classes.chartWrapper}>
                        <Bar options={options} data={data}/>
                    </div>
                </Col>
                {showEmployeeBlock()}
                {showClientBlock()}
                {showEquipmentBlock()}
                {showProjectBlock()}
                {showProductBlock()}
                {showInvoiceBlock()}
                {showTransportOrderBlock()}
                {showGpsRouteBlock()}
                {showVehicleBlock()}
            </Row>
        )
    }
    return (
        <div className={classes.homeEmployee}>

        </div>
    )
}
Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(Home);

