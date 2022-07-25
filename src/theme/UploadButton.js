import React from "react"
import {Switch} from "antd";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
import {useTranslation, withTranslation} from "react-i18next";
import EnglishIcon from "../assets/images/en.png";
import VietnameseIcon from "../assets/images/vi.png";
import i18n, {LANGUAGE_FR} from "../i18n";
import {LANGUAGE_EN, LANGUAGE_VI} from "../constants/constants";
import {PlusOutlined} from "@ant-design/icons";

const styles = {
    container: {

    }
}
const UploadButton = (props) => {
    const {
        classes
    } = props;
    const {t} = useTranslation();
    return (
        <div className={classes.container}>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>{t('label.upload_image')}</div>
        </div>
    )
}

UploadButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter, withTranslation())(UploadButton);
