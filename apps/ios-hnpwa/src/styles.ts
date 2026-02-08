import type { ViewStyle, TextStyle } from '@tempots/native'

// HN Orange brand color
export const HN_ORANGE = '#ff6600'
export const HN_BG = '#f6f6ef'
export const LINK_COLOR = '#000000'
export const META_COLOR = '#828282'
export const HEADER_TEXT = '#ffffff'

export const styles = {
  // Root container
  root: {
    flex: 1,
    backgroundColor: HN_BG,
  } as ViewStyle,

  // Header bar
  header: {
    backgroundColor: HN_ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  } as ViewStyle,

  headerLogo: {
    backgroundColor: '#ffffff',
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 2,
  } as ViewStyle,

  headerLogoText: {
    color: HN_ORANGE,
    fontSize: 14,
    fontWeight: 'bold',
  } as TextStyle,

  headerTab: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginRight: 2,
  } as ViewStyle,

  headerTabText: {
    color: HEADER_TEXT,
    fontSize: 13,
  } as TextStyle,

  headerTabActive: {
    color: HEADER_TEXT,
    fontSize: 13,
    fontWeight: 'bold',
  } as TextStyle,

  // Feed list
  feedContainer: {
    flex: 1,
  } as ViewStyle,

  feedItem: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  } as ViewStyle,

  feedIndex: {
    width: 30,
    color: META_COLOR,
    fontSize: 13,
    textAlign: 'right',
    marginRight: 8,
  } as TextStyle,

  feedContent: {
    flex: 1,
  } as ViewStyle,

  feedTitle: {
    fontSize: 15,
    color: LINK_COLOR,
  } as TextStyle,

  feedDomain: {
    fontSize: 12,
    color: META_COLOR,
    marginTop: 2,
  } as TextStyle,

  feedMeta: {
    fontSize: 12,
    color: META_COLOR,
    marginTop: 4,
  } as TextStyle,

  // Article view
  articleContainer: {
    flex: 1,
    padding: 12,
  } as ViewStyle,

  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: LINK_COLOR,
  } as TextStyle,

  articleDomain: {
    fontSize: 13,
    color: META_COLOR,
    marginTop: 4,
  } as TextStyle,

  articleMeta: {
    fontSize: 13,
    color: META_COLOR,
    marginTop: 8,
    marginBottom: 12,
  } as TextStyle,

  articleContent: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 16,
  } as TextStyle,

  // Comments
  commentMeta: {
    fontSize: 12,
    color: HN_ORANGE,
    marginBottom: 4,
  } as TextStyle,

  commentContent: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  } as TextStyle,

  commentIndent: (depth: number) =>
    ({
      marginLeft: depth * 16,
      paddingLeft: 8,
      borderLeftWidth: depth > 0 ? 2 : 0,
      borderLeftColor: '#e0e0e0',
      marginBottom: 8,
    } as unknown as ViewStyle),

  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  } as ViewStyle,

  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: HN_ORANGE,
    borderRadius: 4,
    marginHorizontal: 4,
  } as ViewStyle,

  paginationButtonDisabled: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#cccccc',
    borderRadius: 4,
    marginHorizontal: 4,
  } as ViewStyle,

  paginationButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  } as TextStyle,

  paginationInfo: {
    fontSize: 14,
    color: META_COLOR,
    marginHorizontal: 8,
  } as TextStyle,

  // Profile
  profileContainer: {
    padding: 16,
  } as ViewStyle,

  profileRow: {
    flexDirection: 'row',
    marginBottom: 12,
  } as ViewStyle,

  profileLabel: {
    width: 80,
    fontSize: 14,
    color: META_COLOR,
    fontWeight: 'bold',
  } as TextStyle,

  profileValue: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  } as TextStyle,

  // Loading / Error / NotFound
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  } as ViewStyle,

  errorText: {
    fontSize: 16,
    color: '#cc0000',
    textAlign: 'center',
  } as TextStyle,

  notFoundText: {
    fontSize: 18,
    color: META_COLOR,
    textAlign: 'center',
  } as TextStyle,

  // Back button
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
  } as ViewStyle,

  backButtonText: {
    color: HEADER_TEXT,
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
} as const
