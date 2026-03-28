import React, {useCallback, useEffect, useState} from "react";
import {Collapse} from 'react-collapse';
import {ArrowUpIcon} from "@components/icons/ArrowUpIcon";
import {ArrowDownIcon} from "@components/icons/ArrowDownIcon";
import {PlayIcon} from "@components/icons/PlayIcon";
import {useAppSelector} from "@hooks/useAppSelector";
import {useAppDispatch} from "@hooks/useAppDispatch";
import {blockSliceActions} from "@features/blockSlice";
import {LectureTopic} from "../types/type";
import {appSliceActions} from "@features/appSlice";

const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const Topics = () => {
    const dispatch = useAppDispatch();

    let cumulativeTime = 0;

    const {config, lectureName} = useAppSelector(state => state.app);
    const {currentBlockId} = useAppSelector(state => state.block);
    const [topics, setTopics] = useState<LectureTopic[]>([]);


    const transformData = useCallback((): LectureTopic[] => {
        const {topics, blocks} = config;
        let count = 0;

        return topics.map(topic => {
            let totalBlockTime = 0
            const topicBlocks = blocks
                .filter(block => block.topicId === topic.id && block.type !== 'prompt')
                .map((block) => {
                    let blockName = block?.topicName;
                    let blockTime = 0;

                    if (block.type === 'just' || (block.type === 'question' && (block.content?.text || block.content?.audio))) {
                        if (block.content?.audio) {
                            blockTime = (block.content.audio.length * 50) / 1000;
                        } else if (block.content?.text) {
                            blockTime = (block.content.text.length * 50) / 1000;
                        }
                    }

                    totalBlockTime += blockTime

                    if (!blockName && block.type === 'question') {
                        count += 1;
                        blockName = `Вопрос ${count}`;
                    } else if (!blockName && block.content?.text) {
                        blockName = `${block.content.text.slice(0, 15)}...`;
                    } else if (!blockName) {
                        blockName = `Блок ${block.id}`;
                    }

                    const startTime = cumulativeTime === 0 ? 0 : cumulativeTime + 1;
                    cumulativeTime += blockTime;

                
                    return {
                        id: block.id,
                        name: blockName,
                        active: currentBlockId === block.id,
                        time: block.type === 'just' || (block.type === 'question' && (block.content?.text || block.content?.audio)) ? formatTime(startTime) : null,
                        blockId: topic.blockId ?? null,
                    };
                });


            return {
                id: topic.id,
                name: topic.name,
                blockId: topic.blockId ?? null,
                isOpen: topicBlocks.filter(block => block.active).length > 0,
                items: topicBlocks,
                sumTime: totalBlockTime,
            };
        });
    }, [config]);


    const handleItemClick = useCallback((topicId: string, itemId: string) => {
        setTopics(prevTopics =>
            prevTopics.map(topic => {
                if (topic.id === topicId) {
                    return {
                        ...topic,
                        items: topic.items.map(item => ({
                            ...item,
                            active: item.id === itemId ? !item.active : false,
                        })),
                    };
                }
                return topic;
            })
        );
    }, []);


    const handleToggle = useCallback((topic: any) => {

        if (topic.isOpen) {
            setTopics(topics.map((item: any) => {
                if (item.id === topic.id) {
                    item.isOpen = false;
                }
                return item;
            }))
            return
        }

        setTopics(topics.map((item: any) => {
            item.isOpen = item.id === topic.id;
            return item;
        }))

    }, [topics])

    useEffect(() => {
        if (config && config.topics && config.blocks) {
            setTopics(transformData());
        }
    }, [config, transformData]);

    return (
        <div className={'topics'}>
            <div style={{padding: "5px"}}>
                {lectureName}
            </div>
            <div style={{
                maxHeight: "550px",
                height: "90%",
                overflowY: "auto",
                scrollbarWidth: 'thin',
            }}>                 {
                topics.map((topic, index) => (
                    <div
                        key={index}
                        className={topic.isOpen ? 'topicsActive' : "topicsDisabled"}
                    >
                        <div style={{
                            display: "flex",
                            gap: "8px",
                            paddingBottom: "8px",
                            alignItems: "center",
                            cursor: "pointer",
                            marginLeft: "16px",
                        }}
                        >
                            <div style={{
                                backgroundColor: topic.isOpen ? "#1A1E27" : "#0C0F12",
                                padding: "8px",
                                borderRadius: "50%",
                                display: "flex",
                            }}
                                 onClick={() => {
                                     handleToggle(topic)
                                 }}

                            >
                                {
                                    topic.isOpen ? <ArrowUpIcon/> : <ArrowDownIcon/>
                                }
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                                onClick={() => {
                                    dispatch(appSliceActions.setCurrentTopicId(topic.id));
                                    if (!topic.isOpen && topic.blockId !== null) {
                                        dispatch(blockSliceActions.next(topic.blockId));
                                    }
                                }}>
                                <div>{topic.name}</div>
                                <div>{formatTime(topic.sumTime)}</div>

                            </div>
                        </div>
                        <Collapse isOpened={topic.isOpen}>
                            {
                                topic.items.map((item: any, index2: number) => (
                                    <div
                                        key={index2}
                                        className={item.active ? "active-collapse" : "disabled-collapse"}
                                    >
                                        <div
                                            onClick={() => {
                                                dispatch(blockSliceActions.next(item.id));
                                                handleItemClick(topic.id, item.id);
                                                dispatch(appSliceActions.setCurrentTopicId(topic.id));
                                            }}
                                            className={item.active ? "play-icon-active" : "play-icon-disabled"}
                                        >
                                            <PlayIcon width={9} height={9}
                                                      color={item.active ? "#74D414" : "#9DA3AE"}
                                                      active={item.active}
                                            />
                                        </div>
                                        <div style={{
                                            flex: 1
                                        }}>
                                            {item.name}
                                        </div>
                                        <div className={'text-time'}>
                                            {item.time}
                                        </div>
                                    </div>
                                ))
                            }
                        </Collapse>
                    </div>
                ))
            }
            </div>
        </div>
    )
}