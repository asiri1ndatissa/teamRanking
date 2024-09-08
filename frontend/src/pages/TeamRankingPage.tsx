import React from "react";
import RightWidgets from "../components/RightWidgets";
import { useParams } from "react-router-dom";
import TeamRankingList from "../components/teamRanking/centerWidgets/TeamRankingList/TeamRankingList";
import "./commonPage.scss";
import LeftWidgets from "../components/LeftWidgets";

const TeamRankingPage = () => {
  const { year, month, day } = useParams();


  return (
    <>
      <div className="pageContent">
        <div className="pageLeft">
          <LeftWidgets>
            <div>Recent Activity</div>
          </LeftWidgets>
        </div>
        <div className="pageCenter">
          <TeamRankingList date={`${year}-${month}-${day}`} />
        </div>
        <div className="pageRight">
          <RightWidgets>
            <div>Recent Activity</div>
          </RightWidgets>
        </div>
      </div>
    </>
  );
};

export default TeamRankingPage;
