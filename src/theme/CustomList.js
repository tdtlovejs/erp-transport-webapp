import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {Pagination, Table} from "antd";
import _, {debounce} from 'lodash';
import axiosClient from "../api/axiosClient";
import {
    Input,
} from 'antd';
import {useTranslation} from "react-i18next";

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',

    },
    header: {
        display: 'flex',
        padding: '10px 0',
        alignItems: 'center',
        justifyContent: 'center',
        '& .ant-input-search': {
            width: 'auto'
        }
    },
    footer: {
        display: 'flex',
        padding: '10px 0',
        justifyContent: 'center'
    }
}
const CustomList = (props) => {
    const {
        apiNameList,
        forceUpdate,
        columns,
        classes,
        hiddenSearch,
        expandable,
        params
    } = props;
    const {t} = useTranslation();
    const [data, setData] = useState([]);
    const [searchTextTemp, setSearchTextTemp] = useState('');
    const [nbResults, setNbResults] = useState(0)
    const [options, setOptions] = useState({
        page: 1,
        isEnd: null,
        searchText: '',
        loading: false
    })
    const {
        page,
        isEnd,
        searchText,
        loading
    } = options;
    useEffect(() => {
        if (forceUpdate) {
            // setData([])
            if (page === 1) {
                setOptions(prev => ({
                    ...prev,
                    isEnd: false,
                }))
                getData(page)
            } else {
                setOptions(prev => ({
                    ...prev,
                    page: 1,
                    isEnd: false,
                }))
            }
        }
    }, [forceUpdate])
    useEffect(() => {
        if (page) {
            getData(page)
        }
    }, [page, searchText])
    const getData = (currentPage) => {
        setOptions(prev => ({
            ...prev,
            loading: true
        }))
        let strParams = '';
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                strParams += `&${key}=${value}`
            }
        }
        axiosClient.get(`${apiNameList}?page=${currentPage}&search=${searchText}${strParams}`)
            .then(res => {
                setNbResults(res.data.nbResults ?? 0);
                if (Array.isArray(res.data.items)) {
                    setData(res.data.items.map((item, index) => ({...item, key: index})))
                    setOptions(prev => ({
                        ...prev,
                        loading: false,
                        ...(page >= res.data.nbPages ? {isEnd: true} : {}),
                    }))
                } else {
                    setOptions(prev => ({
                        ...prev,
                        loading: false
                    }))
                }
            })
            .catch(err => {
                setOptions(prev => ({
                    ...prev,
                    loading: false
                }))
            })
    }
    const onChangeSearch = (text) => {
        setData([])
        setOptions(prev => ({
            ...prev,
            page: 1,
            isEnd: false,
            searchText: text
        }))
    }
    const debounceUpdate = useCallback(debounce((nextValue) => {
        onChangeSearch(nextValue);
    }, 200), [])
    useEffect(() => {
        if (searchTextTemp !== searchText) {
            debounceUpdate(searchTextTemp)
        }
    }, [searchTextTemp])

    return (
        <div className={classes.container}>
            {!hiddenSearch && <div className={classes.header}>
                <Input.Search
                    allowClear
                    value={searchTextTemp}
                    onChange={(event) => {
                        setSearchTextTemp(event.target.value)
                    }}
                    placeholder={t('label.search')}
                />
            </div>}
            <Table
                columns={columns}
                dataSource={data}
                expandable={expandable}
                pagination={false}
                loading={loading}
            />
            <div className={classes.footer}>
                {nbResults ? <Pagination
                    current={page}
                    total={nbResults}
                    pageSize={5}
                    onChange={(value) => {
                        setOptions(prev => ({
                            ...prev,
                            page: value
                        }))
                    }}
                /> : <></>}
            </div>
        </div>
    )
}

CustomList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(CustomList);
