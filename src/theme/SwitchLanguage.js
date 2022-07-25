import React from "react"
import {Switch} from "antd";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
import {withTranslation} from "react-i18next";
import EnglishIcon from "../assets/images/en.png";
import VietnameseIcon from "../assets/images/vi.png";
import i18n, {LANGUAGE_FR} from "../i18n";
import {LANGUAGE_EN, LANGUAGE_VI} from "../constants/constants";

const styles = {
    switchContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    switchViewType: {
        display: 'flex',
        '& .label': {
            padding: '0 5px',
            '& img': {
                height: 24,
                width: 24,
            }
        },
        '& button': {
            backgroundColor: '#1890ff'
        }
    },
    imgSwitch: {
        height: 16,
        width: 16,
    }
}
const SwitchLanguage = (props) => {
    const {
        classes
    } = props;
    return (
        <div className={classes.switchContainer}>
            <div className={classes.switchViewType}>
                <Switch
                    checkedChildren={<img className={classes.imgSwitch} src={EnglishIcon} />}
                    unCheckedChildren={<img className={classes.imgSwitch} src={VietnameseIcon} />}
                    checked={i18n.language === LANGUAGE_EN}
                    onChange={(checked) => {
                        i18n.changeLanguage(checked ? LANGUAGE_EN : LANGUAGE_VI)
                    }}
                />
            </div>
        </div>
    )
}

SwitchLanguage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter, withTranslation())(SwitchLanguage);
