import React from 'react';
import { Link } from 'react-router-dom';
import { TbCardsFilled } from 'react-icons/tb';
import { FaStar } from 'react-icons/fa';

const AnimeDataList = ({ recommendationsData = [], relationsData = [] }) => {
    const filteredRecommendations = recommendationsData.filter((rec) =>
        ['OVA', 'SPECIAL', 'TV', 'MOVIE', 'ONA', 'NOVEL'].includes(rec.type || ''),
    );

    const filteredRelations = relationsData.filter((rel) =>
        ['OVA', 'SPECIAL', 'TV', 'MOVIE', 'ONA', 'NOVEL', 'MANGA'].includes(
            rel.type || '',
        ),
    );

    const getIndicatorColor = (status) => {
        switch (status) {
            case 'FINISHED':
                return 'bg-green-500';
            case 'Cancelled':
                return 'bg-red-500';
            case 'NOT_YET_RELEASED':
                return 'bg-yellow-500';
            case 'RELEASING':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="flex bg-[#0E0E0E] flex-col gap-4">
            {filteredRelations.length > 0 && (
                <div className="bg-[#0E0E0E] rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-2">RELATED</h2>
                    {filteredRelations
                        .slice(0, window.innerWidth > 500 ? 5 : 3)
                        .map((relation, index) => (
                            <Link
                                to={`/watch/${relation.id}`}
                                key={relation.id}
                                className="text-black no-underline"
                                title={`${relation.title.userPreferred}`}
                                aria-label={`Watch ${relation.title.userPreferred}`}
                            >
                                <div
                                    className={`flex items-center bg-[#141414] rounded-lg shadow-md mb-2 p-2 transition-all duration-200 ease-in-out transform hover:translate-x-1 ${
                                        index === 0 ? 'opacity-100' : 'opacity-75'
                                    }`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <img
                                        src={relation.image}
                                        alt={relation.title.userPreferred}
                                        className="w-16 h-24 object-cover rounded-lg"
                                        loading="lazy"
                                    />
                                    <div className="flex flex-col ml-2">
                                        <div className="flex items-center mb-1">
                                            <div
                                                className={`w-2 h-2 rounded-full mr-2 ${getIndicatorColor(
                                                    relation.status,
                                                )}`}
                                            />
                                            <p className="text-sm text-[#E8E8E8] line-clamp-2">
                                                {relation.title.english ??
                                                    relation.title.romaji ??
                                                    relation.title.userPreferred}
                                            </p>
                                        </div>
                                        <div className="text-xs text-[#666666A6] flex gap-0">
                                            {/* Conditionally render each piece of detail only if it's not null or empty */}
                                            {relation.type && `${relation.type} `}
                                            {relation.episodes && (
                                                <div className='mx-1 flex'>
                                                    <TbCardsFilled aria-hidden="true" className='mr-[2px]' />{' '}
                                                    {`${relation.episodes} `}
                                                </div>
                                            )}
                                            {relation.rating && (
                                                <div className='flex mx-1'>
                                                    <FaStar aria-hidden="true" className='mr-[2px]' />{' '}
                                                    {`${relation.rating} `}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            )}
            {filteredRecommendations.length > 0 && (
                <div className="bg-[#0E0E0E] rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-2">RECOMMENDED</h2>
                    {filteredRecommendations
                        .slice(0, window.innerWidth > 500 ? 5 : 3)
                        .map((recommendation, index) => (
                            <Link
                                to={`/watch/${recommendation.id}`}
                                key={recommendation.id}
                                className="text-black no-underline"
                                title={`Watch ${recommendation.title.userPreferred}`}
                            >
                                <div
                                    className={`flex items-center bg-[#141414] rounded-lg shadow-md mb-2 p-2 transition-all duration-200 ease-in-out transform hover:translate-x-1 ${
                                        index === 0 ? 'opacity-100' : 'opacity-75'
                                    }`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <img
                                        src={recommendation.image}
                                        alt={recommendation.title.userPreferred}
                                        className="w-16 h-24 object-cover rounded-lg"
                                        loading="lazy"
                                    />
                                    <div className="flex flex-col ml-2">
                                        <div className="flex items-center mb-1">
                                            <div
                                                className={`w-2 h-2 rounded-full mr-2 ${getIndicatorColor(
                                                    recommendation.status,
                                                )}`}
                                            />
                                            <p className="text-sm text-[#E8E8E8] line-clamp-2">
                                                {recommendation.title.english ??
                                                    recommendation.title.romaji ??
                                                    recommendation.title.userPreferred}
                                            </p>
                                        </div>
                                        <div className="text-xs flex text-[#666666A6]">
                                            {/* Similar conditional rendering for recommendation details */}
                                            {recommendation.type && `${recommendation.type} `}
                                            {recommendation.episodes && (
                                                <div className='flex mx-2'>
                                                    <TbCardsFilled aria-hidden="true" className='mr-[2px]' />{' '}
                                                    {`${recommendation.episodes} `}
                                                </div>
                                            )}
                                            {recommendation.rating && (
                                                <div className='flex mx-2'>
                                                    <FaStar aria-hidden="true" className='mr-[2px]' />{' '}
                                                    {`${recommendation.rating} `}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            )}
        </div>
    );
};

export default AnimeDataList;