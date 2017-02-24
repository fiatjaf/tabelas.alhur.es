from random import shuffle, choice

def compute_rounds(teams, rematch=False):
    # shuffle teams order
    shuffle(teams)

    # get all the matches (with balanced home/away distribution)
    rounds = []
    nteams = len(teams)

    # if odd number of teams, add a BYE
    remove_bye = False
    if nteams % 2 != 0:
        teams.append('_BYE')
        nteams = len(teams)
        remove_bye = True

    nrounds = nteams-1
    halfteams = int(nteams/2)

    pivot = teams[0]
    homerow = teams[1:(halfteams)]
    awayrow = teams[:(halfteams)-1:-1]

    for rnd in range(nrounds):
        # add all matches in the row
        pivotmatch = (pivot, awayrow[0])
        matches = [pivotmatch]
        for i in range((halfteams)-1):
            match = (homerow[i], awayrow[i+1])
            matches.append(match)

        # rotate rows
        homerow.insert(0, awayrow.pop(0))
        awayrow.append(homerow.pop(-1))

        # invert home/away
        if not rnd % 2:
            matches[0] = (matches[0][1], matches[0][0])

        rounds.append(matches)

    # remove bye
    if remove_bye:
        teams.remove('_BYE')
        for matches in rounds:
            for match in matches:
                if '_BYE' in match:
                    matches.remove(match)
                    break

    shuffle(rounds)

    if rematch:
        return_rounds = []
        for matches in rounds:
            fixtures = []
            for match in matches:
                rematch = (match[1], match[0])
                fixtures.append(rematch)
            return_rounds.append(fixtures)
        rounds += return_rounds

    return rounds

if __name__ == '__main__':
    from pprint import pprint as pp
    teams1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    teams2 = ['A', 'B', 'C', 'D']
    pp(teams1)
    pp(rounds(teams1))
    print
    pp(teams2)
    pp(compute_rounds(teams2, True))
