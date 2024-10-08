import React from "react";
import Table from "../../../ui/Table";
import TablePLayerCard, { EProfile } from "./TablePLayerCard";
import { ITableData } from "../../../../utils/interfaces/table.interface";
import moment from "moment";
import {
  IPlayer,
  ITeamRank,
} from "../../../../utils/interfaces/teamRank.interface";
import { useNavigate } from "react-router-dom";
import { EPlayerProfileTabs } from "../../../../utils/enumsNModals/playerProfile";

interface IProp {
  team: ITeamRank;
}

const TPRoster = ({ team }: IProp) => {
  const navigate = useNavigate();

  const playerHandler = (player: IPlayer) => {
    const name = player.name.split(" ").join("-");
    navigate(`/player/${player.id}/${name}#tab-${EPlayerProfileTabs.INFO}`);
  };

  const getTimeOnTeam = (date: string) => {
    const now = moment();
    const dob = moment(date);

    const years = now.diff(dob, "years");
    dob.add(years, "years");
    const months = now.diff(dob, "months");

    return (
      <div className="d-flex flex-column">
        <span>{years} years</span>
        <span>{months} months</span>
      </div>
    );
  };

  const coachTableData: ITableData = {
    columns: [
      { header: "coach", key: "coach" },
      { header: "time on team", key: "timeOnTeam", style: "text-center" },
      { header: "maps coached", key: "mapsCoached", style: "text-center" },
      { header: "trophies", key: "trophies", style: "text-center" },
      { header: "win rate", key: "winRate", style: " text-center" },
    ],

    data: [
      {
        coach: {
          val: (
            <TablePLayerCard
              src={team?.coach?.image || ""}
              flag={team?.coach?.flag || ""}
              name={team?.coach?.nicName || ""}
              profile={EProfile.COACH}
            />
          ),
        },
        timeOnTeam: {
          val: getTimeOnTeam(team?.coach?.joinedDate || "2014-02-12"),
          style: "text-dark align-middle",
        },
        mapsCoached: {
          val: team?.coach?.mapsCoached,
          style: "text-dark align-middle",
        },
        trophies: {
          val: team?.coach?.trophies,
          style: "text-dark align-middle",
        },
        winRate: {
          // val: `${
          //   team?.coach?.wins / (team?.coach?.lost + team?.coach?.tied)
          // }%`,
          val: `${team?.coach?.wins}%`,
          style: "text-light-dark fw-bold align-middle",
        },
      },
    ],
  };

  const getData = (playerData: IPlayer[]) => {
    const data = playerData?.map((player) => {
      return {
        play: {
          val: (
            <div onClick={() => playerHandler(player)}>
              <TablePLayerCard
                src={player?.image}
                flag={player?.flag}
                name={player?.name}
                profile={EProfile.PLAYER}
              />
            </div>
          ),
        },
        status: {
          val: (
            <div
              className={`p-1 mx-3 rounded bg-light-dark text-light ${
                player?.status === "starter"
                  ? "bg-light-dark"
                  : "bg-dark-danger"
              }`}
            >
              {player?.status}
            </div>
          ),
          style: "text-dark align-middle",
        },
        timeOnTeam: {
          val: getTimeOnTeam(player?.joinedDate),
          style: "text-dark align-middle",
        },
        mapsPlayed: {
          val: player?.mapsPlayed,
          style: "text-dark align-middle",
        },
        rating: {
          val: player?.rating,
          style: `${
            player?.rating < 1 ? "text-danger" : "text-success"
          } align-middle`,
        },
      };
    });
    return data;
  };

  const playersTableData: ITableData = {
    columns: [
      { header: "player", key: "play" },
      { header: "status", key: "status", style: "text-center" },
      { header: "time on team", key: "timeOnTeam", style: "text-center" },
      { header: "maps played", key: "mapsPlayed", style: "text-center" },
      { header: "Rating", key: "rating", style: "text-center" },
    ],

    data: getData(team?.players || []),
  };

  return (
    <>
      <Table
        title={`Coach of ${team?.teamName}`}
        subTitle="Stats from entire coach period"
        tableData={coachTableData}
      />
      <Table
        title={`Players of ${team?.teamName}`}
        subTitle="Stats from entire team period *"
        tableData={playersTableData}
      />
    </>
  );
};

export default TPRoster;
