import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Rashifal } from "../backend.d";
import { useActor } from "./useActor";

export function useRashifalByDate(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Rashifal[]>({
    queryKey: ["rashifal", date],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRashifalByDate(date);
    },
    enabled: !!actor && !isFetching && !!date,
  });
}

export function useAllDates() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["allDates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrUpdateRashifal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      date,
      rashi,
      prediction,
    }: { date: string; rashi: string; prediction: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createOrUpdateRashifal(date, rashi, prediction);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rashifal", variables.date] });
      queryClient.invalidateQueries({ queryKey: ["allDates"] });
    },
  });
}
