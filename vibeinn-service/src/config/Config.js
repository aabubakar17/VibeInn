import { config } from "dotenv";

export default class Config {
  static load = () => {
    config();
  };
}
