const getErrorMessage = (error) => {

    const data = error?.response?.data;

    if (!data) {
        return "Something went wrong.";
    }

    if (typeof data.message === "string") {
        return data.message;
    }

    if (typeof data.detail === "string") {
        return data.detail;
    }

    for (const key in data) {

        const value = data[key];

        if (Array.isArray(value)) {
            return value[0];
        }

        if (typeof value === "string") {
            return value;
        }

    }

    return "Something went wrong.";

};

export default getErrorMessage;