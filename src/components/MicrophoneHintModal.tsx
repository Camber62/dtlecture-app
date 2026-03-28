import React, {useEffect, useState} from "react";
import Modal from 'react-modal';
import {useAppSelector} from "@hooks/useAppSelector";
import { useTranslation } from "react-i18next";


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const MicrophoneHintModal = ({isOpen}: {isOpen: boolean}) => {

    const {t} = useTranslation();

    const {isRecording, isRecognize} = useAppSelector(state => state.microphone);
    const [hintText, setHintText] = useState("");

    useEffect(() => {
        if (isRecording) {
            setHintText(t("chat_input.hint_text_2"));
        } else if (isRecognize) {
            setHintText(t("chat_input.hint_text_3"));
        } else if (!isRecording && !isRecognize) {
            setHintText(t("chat_input.hint_text_6"));
        }
    }, [isRecording, isRecognize, t]);

    return (
        <Modal
            isOpen={isOpen}
            style={customStyles}
            className={"test-new-modal"}
            contentLabel="Example Modal"
        >
            <div>
                <h5 style={{color: "#ccc", textAlign: "center"}}>{hintText}</h5>
            </div>
        </Modal>
    );
};

export default MicrophoneHintModal;
