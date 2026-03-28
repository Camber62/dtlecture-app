import React from "react"
import {PlayColorIcon} from "@components/icons/PlayColorIcon";
import {useTranslation} from "react-i18next";

export const ContinueScene = () => {
    const { t } = useTranslation();

    return (
        <div className="continue-scene-container">
            <p>
                {t("welcome_back")}
                <br/>
                «<span className="colorize">{t("topic_name")}</span>».
            </p>
            <p className="small">
                {t("continue_lecture_prompt")}« <PlayColorIcon/> »
            </p>
        </div>
    )

}