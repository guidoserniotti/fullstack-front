import PropTypes from 'prop-types';
import { useState, useImperativeHandle, forwardRef } from 'react';

const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    useImperativeHandle(refs, () => {
        return {
            toggleVisibility,
        };
    });

    return (
        <div className='togglableContent'>
            <div style={hideWhenVisible} className='togglableContent-invisible'>
                <button onClick={toggleVisibility}>
                    {props.toggleTrueButtonLabel}
                </button>
            </div>
            <div style={showWhenVisible} className='togglableContent-visible'>
                {props.children}
                <button onClick={toggleVisibility}>
                    {props.toggleFalseButtonLabel}
                </button>
            </div>
        </div>
    );
});

export default Togglable;
