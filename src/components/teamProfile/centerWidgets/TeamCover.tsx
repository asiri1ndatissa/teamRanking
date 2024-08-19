import React from "react";
import "./teamCover.scss";
import { ITeamRank } from "../../../utils/interfaces/teamRank.interface";
import { Image } from "react-bootstrap";

interface IProp {
  team: ITeamRank;
}

const TeamCover = ({ team }: IProp) => {
  return (
    <div className="cover">
      {team?.players?.map((player, index) => (
        <div
          key={index}
          style={{ position: "relative", width: "165px", height: "190px" }}
        >
          <Image
            src={player.image}
            alt="profile"
            width={185}
            height={185}
            className="profile-image mt-2"
          />
          <div className="team-player-name">
            <Image src={player.flag} alt="flag" className="me-1" />
            {player.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamCover;
