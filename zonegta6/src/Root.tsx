import { LeonidaComposition } from "./Composition";
import { NotaShortComposition } from "./nota/NotaShort";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <LeonidaComposition />
      <NotaShortComposition />
    </>
  );
};
