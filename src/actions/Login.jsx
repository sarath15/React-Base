export const LOGIN_IS_COMPLETED = 'LOGIN_IN_COMPLETED';
export const LOGIN_IS_PROGRESS = 'LOGIN_IN_PROGRESS';
export const LOGIN_IS_FAILURE = 'LOGIN_IN_FAILURE';
export const FORGETPASSWORD_IS_COMPLETED = 'FORGETPASSWORD_IN_COMPLETED';
export const FORGETPASSWORD_IS_PROGRESS = 'FORGETPASSWORD_IN_PROGRESS';
export const FORGETPASSWORD_IS_FAILURE = 'FORGETPASSWORD_IN_FAILURE';
export const CONFIRMOTP_IS_COMPLETED = 'CONFIRMOTP_IN_COMPLETED';
export const CONFIRMOTP_IS_PROGRESS = 'CONFIRMOTP_IN_PROGRESS';
export const CONFIRMOTP_IS_FAILURE = 'CONFIRMOTP_IN_FAILURE';

export const setLoginAsProgress = () => ({
    type: LOGIN_IS_PROGRESS,
    isRequestInProgress : true
});

export const setLoginAsCompleted = () => ({
    type: LOGIN_IS_COMPLETED,
    isRequestInProgress : false
});

export const setLoginAsFailure = () => ({
    type: LOGIN_IS_FAILURE,
    isRequestInProgress : false
});

export const setForgetPasswordAsProgress = () => ({
    type: FORGETPASSWORD_IS_PROGRESS,
    isRequestInProgress : true
});

export const setForgetPasswordAsCompleted = () => ({
    type: FORGETPASSWORD_IS_COMPLETED,
    isRequestInProgress : false
});

export const setForgetPasswordAsFailure = () => ({
    type: FORGETPASSWORD_IS_FAILURE,
    isRequestInProgress : false
});

export const setConfirmOtpAsProgress = () => ({
    type: CONFIRMOTP_IS_PROGRESS,
    isRequestInProgress : true
});

export const setConfirmOtpAsCompleted = () => ({
    type: CONFIRMOTP_IS_COMPLETED,
    isRequestInProgress : false
});

export const setConfirmOtpAsFailure = () => ({
    type: CONFIRMOTP_IS_FAILURE,
    isRequestInProgress : false
});



