import React, { useEffect, useState } from "react";
import LeftWidgets from "../components/LeftWidgets";
import RightWidgets from "../components/RightWidgets";
import TeamCover from "../components/teamProfile/centerWidgets/TeamCover";
import TeamStatus from "../components/teamProfile/centerWidgets/TeamStatus";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ITeamRank } from "../utils/interfaces/teamRank.interface";
import { rankingDetails } from "../utils/enumsNModals/teamRanking";
import TabSet from "../components/ui/TabSet";
import {
  ETeamProfileTabs,
  teamProfileTabs,
} from "../utils/enumsNModals/teamProfile";
import { ITab } from "../utils/interfaces/tabSet.interface";
import TPRoster from "../components/teamProfile/centerWidgets/roster/Roster";
import TPMatches from "../components/teamProfile/centerWidgets/matches/Matches";
import TPInfo from "../components/teamProfile/centerWidgets/info/Info";
import "./commonPage.scss";
// import useTeamRanks from "../hooks/useTeamRanking";

const TeamProfilePage = () => {
  const location = useLocation();
  const tab = location.hash.split("-")[1];

  const [selectedTeam, setSelectedTeam] = useState<ITeamRank>({} as ITeamRank);
  const [selectedTab, setSelectedTab] = useState<string>(tab);
  // const {teamRanks} =useTeamRanks();
  const teamRanks : any = []

  const navigate = useNavigate();
  const { teamId } = useParams();

  useEffect(() => {
    const team = teamRanks.find((team: any) => team.teamId === teamId);
    if (team) {

      setSelectedTeam(team);
    } else {
      navigate(-1);
    }
  }, [teamId, navigate]);

  const onChangeTab = (val: ITab) => {
    if (val) {
      navigate(`#tab-${val?.id}`, { replace: true });
    }
    setSelectedTab(val.id);
  };

  return (
    <>
      <div className="pageContent">
        <div className="pageLeft">
          <LeftWidgets>
            <div>Filters</div>
          </LeftWidgets>
        </div>
        <div className="pageCenter">
          <TeamCover team={selectedTeam} />
          <TeamStatus team={selectedTeam} />
          <TabSet
            tabs={teamProfileTabs}
            selected={selectedTab}
            onChangeTab={onChangeTab}
          >
            {selectedTab === ETeamProfileTabs.INFO && (
              <TPInfo team={selectedTeam} />
            )}
            {/* {selectedTab === ETeamProfileTabs.ROSTER && (
              <TPRoster team={selectedTeam} />
            )}
            {selectedTab === ETeamProfileTabs.MATCHES && (
              <TPMatches team={selectedTeam} />
            )} */}
          </TabSet>
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

export default TeamProfilePage;
