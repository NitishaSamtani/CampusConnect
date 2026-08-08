import axios from "../utils/axios";

export const getCompanies = async () => {

    const res = await axios.get("/companies");

    return res.data;

};

export const getRoles = async (companyId) => {

    const res = await axios.get(

        `/companies/${companyId}/roles`

    );

    return res.data;

};

export const getExperiences = async (

    companyId,
    roleId

) => {

    const res = await axios.get(

        `/companies/${companyId}/roles/${roleId}/experiences`

    );

    return res.data;

};