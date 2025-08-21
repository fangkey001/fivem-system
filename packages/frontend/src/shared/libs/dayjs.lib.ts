import Dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";

Dayjs.extend(customParseFormat);
Dayjs.extend(isSameOrBefore);
Dayjs.extend(isSameOrAfter);
Dayjs.extend(isBetween);
Dayjs.extend(duration);
Dayjs.extend(relativeTime);
Dayjs.extend(buddhistEra);
Dayjs.locale("th");

export const dayjs = Dayjs;
