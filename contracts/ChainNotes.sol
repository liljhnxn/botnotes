// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ChainNotes
 * @dev A simple, decentralized on-chain notes contract for Botchain Mainnet.
 * Notes are stored directly on the blockchain and indexed per user wallet.
 * Blockchain data is public and permanent - users must not store private keys or secrets.
 */
contract ChainNotes {
    struct Note {
        uint256 id;
        address owner;
        string title;
        string content;
        uint256 createdAt;
        uint256 updatedAt;
    }

    uint256 public constant MAX_TITLE_LENGTH = 80;
    uint256 public constant MAX_CONTENT_LENGTH = 500;

    // Incremental counter for unique note IDs
    uint256 private _nextNoteId = 1;

    // Mapping from user address to their array of notes
    mapping(address => Note[]) private _userNotes;

    // Mapping from note ID to owner address for O(1) lookups
    mapping(uint256 => address) private _noteOwners;

    // Mapping from note ID to user's array index for O(1) lookups
    mapping(uint256 => uint256) private _noteUserIndices;

    // Events
    event NoteCreated(
        uint256 indexed noteId,
        address indexed owner,
        string title,
        uint256 createdAt
    );

    event NoteUpdated(
        uint256 indexed noteId,
        address indexed owner,
        string title,
        uint256 updatedAt
    );

    // Custom errors
    error EmptyTitle();
    error TitleTooLong(uint256 length, uint256 max);
    error EmptyContent();
    error ContentTooLong(uint256 length, uint256 max);
    error NoteNotFound();
    error NotNoteOwner();
    error IndexOutOfBounds();

    /**
     * @notice Creates a new on-chain note for the caller.
     * @param title Title of the note (1 to 80 bytes).
     * @param content Body of the note (1 to 500 bytes).
     * @return noteId The unique ID assigned to the new note.
     */
    function createNote(
        string calldata title,
        string calldata content
    ) external returns (uint256 noteId) {
        _validateInputs(title, content);

        noteId = _nextNoteId++;
        uint256 timestamp = block.timestamp;

        Note memory newNote = Note({
            id: noteId,
            owner: msg.sender,
            title: title,
            content: content,
            createdAt: timestamp,
            updatedAt: timestamp
        });

        _noteOwners[noteId] = msg.sender;
        _noteUserIndices[noteId] = _userNotes[msg.sender].length;
        _userNotes[msg.sender].push(newNote);

        emit NoteCreated(noteId, msg.sender, title, timestamp);
    }

    /**
     * @notice Updates an existing note owned by the caller.
     * @param noteId The unique ID of the note to update.
     * @param title New title for the note (1 to 80 bytes).
     * @param content New content for the note (1 to 500 bytes).
     */
    function updateNote(
        uint256 noteId,
        string calldata title,
        string calldata content
    ) external {
        address owner = _noteOwners[noteId];
        if (owner == address(0)) {
            revert NoteNotFound();
        }
        if (owner != msg.sender) {
            revert NotNoteOwner();
        }

        _validateInputs(title, content);

        uint256 index = _noteUserIndices[noteId];
        Note storage note = _userNotes[msg.sender][index];

        note.title = title;
        note.content = content;
        note.updatedAt = block.timestamp;

        emit NoteUpdated(noteId, msg.sender, title, block.timestamp);
    }

    /**
     * @notice Returns all notes owned by the caller.
     * @return Array of Note structs owned by msg.sender.
     */
    function getMyNotes() external view returns (Note[] memory) {
        return _userNotes[msg.sender];
    }

    /**
     * @notice Returns total number of notes owned by the caller.
     * @return Total note count for msg.sender.
     */
    function getMyNoteCount() external view returns (uint256) {
        return _userNotes[msg.sender].length;
    }

    /**
     * @notice Returns a single note owned by the caller by its index.
     * @param index The zero-based index in the caller's notes list.
     * @return The Note struct.
     */
    function getMyNote(uint256 index) external view returns (Note memory) {
        if (index >= _userNotes[msg.sender].length) {
            revert IndexOutOfBounds();
        }
        return _userNotes[msg.sender][index];
    }

    /**
     * @dev Validates title and content lengths.
     */
    function _validateInputs(string calldata title, string calldata content) private pure {
        uint256 titleLen = bytes(title).length;
        if (titleLen == 0) {
            revert EmptyTitle();
        }
        if (titleLen > MAX_TITLE_LENGTH) {
            revert TitleTooLong(titleLen, MAX_TITLE_LENGTH);
        }

        uint256 contentLen = bytes(content).length;
        if (contentLen == 0) {
            revert EmptyContent();
        }
        if (contentLen > MAX_CONTENT_LENGTH) {
            revert ContentTooLong(contentLen, MAX_CONTENT_LENGTH);
        }
    }
}
