import React from "react";
import PropTypes from "prop-types";
import {compose} from "redux";
import {withStyles} from "@mui/styles";
import {withRouter} from "react-router-dom";
const styles = {
    container: {
        backgroundColor: '#ffffff',
        padding: '10px 20px',
        margin: '20px 0',
        borderRadius: 9,
        '& .viewBlockTitle': {
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
            fontSize: '1rem',
            marginTop: 20,
        },
        '& .viewBlockContent': {
            display: 'flex',
            flexDirection: 'column',
            '& .imageLogoWrapper': {
                height: 180,
                width: 180,
                maxWidth: '100%',
                overflow: 'hidden',
                '& .imageLogo': {
                    width: '100%'
                }
            }
        }
    }
}
const ViewBlock = (props) => {
    const {
        classes,
        title,
        content
    } = props;
    return (
        <div className={classes.container}>
            <div className="viewBlockTitle">
                {title ?? ""}
            </div>
            <div className="viewBlockContent">
                {content ? content : <></>}
            </div>
        </div>
    )
}
ViewBlock.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), withRouter)(ViewBlock);
