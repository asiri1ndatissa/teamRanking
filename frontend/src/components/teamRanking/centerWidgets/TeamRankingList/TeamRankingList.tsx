import moment from "moment";
import React, { useEffect, useState } from "react";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./rankingList.scss";
import TeamRank from "../TeamRank/TeamRank";
import { rankingDetails } from "../../../../utils/enumsNModals/teamRanking";
import { ITeamRank } from "../../../../utils/interfaces/teamRank.interface";
import useTeamRanks from "../../../../hooks/useTeamRanking";

interface IProp {
  date: string;
}

const TeamRankingList = ({ date }: IProp) => {
  const formattedDate = moment(date, "YYYY-MMMM-D").format("MMMM Do, YYYY");
  const {loading, teamRanks} =useTeamRanks();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="teamRanking-list">
      <div className="date-selector d-flex justify-content-between mt-2">
        <div className="teamRanking-Header">
          Valorant World ranking on {formattedDate}
        </div>
      </div>
      <div className="mt-4">
        {teamRanks.map((rank: ITeamRank, index) => (
          <div key={index}>
            <TeamRank rank={rank} isOpen={index === 0 ? true : false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamRankingList;
